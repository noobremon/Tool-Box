from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import qrcode
import io
import base64
import secrets
import string
import random
import json
import hashlib
from PIL import Image, ImageFilter, ImageDraw
import barcode
from barcode.writer import ImageWriter


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class FavoriteTool(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tool_name: str
    category: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    theme: str = "light"
    favorite_tools: List[str] = []

# Text Tool Models
class TextConvertRequest(BaseModel):
    text: str
    case_type: str  # upper, lower, title, sentence, camel, snake, kebab

class WordCountRequest(BaseModel):
    text: str

class LoremIpsumRequest(BaseModel):
    paragraphs: int = 3

class Base64Request(BaseModel):
    text: str
    encode: bool = True

class URLEncodeRequest(BaseModel):
    text: str
    encode: bool = True

# Color Tool Models
class ColorConvertRequest(BaseModel):
    color: str
    from_format: str  # hex, rgb, rgba, hsl
    to_format: str

class PaletteGenerateRequest(BaseModel):
    base_color: Optional[str] = None
    count: int = 5

class ShadesRequest(BaseModel):
    color: str
    count: int = 10

# CSS Tool Models
class GradientRequest(BaseModel):
    colors: List[str]
    direction: str = "to right"

class BoxShadowRequest(BaseModel):
    h_offset: int = 0
    v_offset: int = 5
    blur: int = 10
    spread: int = 0
    color: str = "rgba(0,0,0,0.3)"

# Misc Tool Models
class QRCodeRequest(BaseModel):
    text: str
    size: int = 300

class PasswordRequest(BaseModel):
    length: int = 16
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_numbers: bool = True
    include_symbols: bool = True

class ShuffleRequest(BaseModel):
    items: List[str]


# Routes
@api_router.get("/")
async def root():
    return {"message": "Toolbox API"}

# Text Tools
@api_router.post("/tools/text/convert")
async def convert_text_case(req: TextConvertRequest):
    text = req.text
    case_type = req.case_type
    
    if case_type == "upper":
        result = text.upper()
    elif case_type == "lower":
        result = text.lower()
    elif case_type == "title":
        result = text.title()
    elif case_type == "sentence":
        result = ". ".join(s.capitalize() for s in text.split(". "))
    elif case_type == "camel":
        words = text.replace("-", " ").replace("_", " ").split()
        result = words[0].lower() + "".join(w.capitalize() for w in words[1:])
    elif case_type == "snake":
        result = text.replace(" ", "_").replace("-", "_").lower()
    elif case_type == "kebab":
        result = text.replace(" ", "-").replace("_", "-").lower()
    else:
        result = text
    
    return {"result": result}

@api_router.post("/tools/text/wordcount")
async def count_words(req: WordCountRequest):
    text = req.text
    words = len(text.split())
    chars = len(text)
    chars_no_spaces = len(text.replace(" ", ""))
    lines = len(text.split("\n"))
    
    return {
        "words": words,
        "characters": chars,
        "characters_no_spaces": chars_no_spaces,
        "lines": lines
    }

@api_router.post("/tools/text/lorem")
async def generate_lorem(req: LoremIpsumRequest):
    lorem_text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    paragraphs = [lorem_text for _ in range(req.paragraphs)]
    return {"result": "\n\n".join(paragraphs)}

@api_router.post("/tools/text/whitespace")
async def remove_whitespace(req: TextConvertRequest):
    text = req.text
    result = " ".join(text.split())
    return {"result": result}

@api_router.post("/tools/text/base64")
async def base64_convert(req: Base64Request):
    if req.encode:
        result = base64.b64encode(req.text.encode()).decode()
    else:
        try:
            result = base64.b64decode(req.text).decode()
        except:
            raise HTTPException(status_code=400, detail="Invalid Base64 string")
    return {"result": result}

@api_router.post("/tools/text/url-encode")
async def url_encode(req: URLEncodeRequest):
    from urllib.parse import quote, unquote
    if req.encode:
        result = quote(req.text)
    else:
        result = unquote(req.text)
    return {"result": result}

# Color Tools
@api_router.post("/tools/color/convert")
async def convert_color(req: ColorConvertRequest):
    def hex_to_rgb(hex_color):
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def rgb_to_hex(r, g, b):
        return f"#{r:02x}{g:02x}{b:02x}"
    
    color = req.color
    from_format = req.from_format
    to_format = req.to_format
    
    # Convert to RGB first
    if from_format == "hex":
        r, g, b = hex_to_rgb(color)
    elif from_format in ["rgb", "rgba"]:
        parts = color.replace("rgb(", "").replace("rgba(", "").replace(")", "").split(",")
        r, g, b = int(parts[0]), int(parts[1]), int(parts[2])
    
    # Convert to target format
    if to_format == "hex":
        result = rgb_to_hex(r, g, b)
    elif to_format == "rgb":
        result = f"rgb({r}, {g}, {b})"
    elif to_format == "rgba":
        result = f"rgba({r}, {g}, {b}, 1)"
    elif to_format == "hsl":
        r_norm, g_norm, b_norm = r/255, g/255, b/255
        cmax = max(r_norm, g_norm, b_norm)
        cmin = min(r_norm, g_norm, b_norm)
        delta = cmax - cmin
        
        l = (cmax + cmin) / 2
        s = 0 if delta == 0 else delta / (1 - abs(2*l - 1))
        
        if delta == 0:
            h = 0
        elif cmax == r_norm:
            h = 60 * (((g_norm - b_norm) / delta) % 6)
        elif cmax == g_norm:
            h = 60 * (((b_norm - r_norm) / delta) + 2)
        else:
            h = 60 * (((r_norm - g_norm) / delta) + 4)
        
        result = f"hsl({int(h)}, {int(s*100)}%, {int(l*100)}%)"
    else:
        result = color
    
    return {"result": result}

@api_router.post("/tools/color/palette")
async def generate_palette(req: PaletteGenerateRequest):
    # Generate harmonious color palette
    if req.base_color:
        base = req.base_color.lstrip('#')
        r, g, b = tuple(int(base[i:i+2], 16) for i in (0, 2, 4))
    else:
        r, g, b = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
    
    palette = []
    for i in range(req.count):
        # Generate variations
        offset = (i * 50) % 255
        new_r = (r + offset) % 256
        new_g = (g + offset + 30) % 256
        new_b = (b + offset + 60) % 256
        palette.append(f"#{new_r:02x}{new_g:02x}{new_b:02x}")
    
    return {"palette": palette}

@api_router.post("/tools/color/shades")
async def generate_shades(req: ShadesRequest):
    base = req.color.lstrip('#')
    r, g, b = tuple(int(base[i:i+2], 16) for i in (0, 2, 4))
    
    shades = []
    for i in range(req.count):
        factor = i / req.count
        new_r = int(r * (1 - factor))
        new_g = int(g * (1 - factor))
        new_b = int(b * (1 - factor))
        shades.append(f"#{new_r:02x}{new_g:02x}{new_b:02x}")
    
    return {"shades": shades}

# CSS Tools
@api_router.post("/tools/css/gradient")
async def generate_gradient(req: GradientRequest):
    colors_str = ", ".join(req.colors)
    css = f"background: linear-gradient({req.direction}, {colors_str});"
    return {"css": css}

@api_router.post("/tools/css/box-shadow")
async def generate_box_shadow(req: BoxShadowRequest):
    css = f"box-shadow: {req.h_offset}px {req.v_offset}px {req.blur}px {req.spread}px {req.color};"
    return {"css": css}

@api_router.post("/tools/css/border-radius")
async def generate_border_radius(tl: int = 0, tr: int = 0, br: int = 0, bl: int = 0):
    css = f"border-radius: {tl}px {tr}px {br}px {bl}px;"
    return {"css": css}

@api_router.post("/tools/css/glassmorphism")
async def generate_glassmorphism(blur: int = 10, opacity: float = 0.3):
    css = f"background: rgba(255, 255, 255, {opacity});\nbackdrop-filter: blur({blur}px);\nborder: 1px solid rgba(255, 255, 255, 0.2);"
    return {"css": css}

# Misc Tools
@api_router.post("/tools/misc/qrcode")
async def generate_qr_code(req: QRCodeRequest):
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(req.text)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.read()).decode()
    
    return {"image": f"data:image/png;base64,{img_base64}"}

@api_router.post("/tools/misc/password")
async def generate_password(req: PasswordRequest):
    chars = ""
    if req.include_uppercase:
        chars += string.ascii_uppercase
    if req.include_lowercase:
        chars += string.ascii_lowercase
    if req.include_numbers:
        chars += string.digits
    if req.include_symbols:
        chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    if not chars:
        raise HTTPException(status_code=400, detail="Must include at least one character type")
    
    password = "".join(secrets.choice(chars) for _ in range(req.length))
    return {"password": password}

@api_router.post("/tools/misc/shuffle")
async def shuffle_list(req: ShuffleRequest):
    items = req.items.copy()
    random.shuffle(items)
    return {"shuffled": items}

@api_router.get("/tools/misc/uuid")
async def generate_uuid():
    return {"uuid": str(uuid.uuid4())}

# JSON formatter
@api_router.post("/tools/code/json-format")
async def format_json(data: dict):
    try:
        formatted = json.dumps(data.get("json_str"), indent=2)
        return {"result": formatted}
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()