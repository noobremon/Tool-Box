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
from datetime import datetime, timezone, timedelta
import qrcode
import io
import base64
import secrets
import string
import random
import json
import hashlib
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import barcode
from barcode.writer import ImageWriter
import re

# Optional AI integration
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    HAS_EMERGENT = True
except ImportError:
    HAS_EMERGENT = False
    LlmChat = None
    UserMessage = None

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db = None
client = None
try:
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'toolbox_db')]
    logger.info("Connected to MongoDB")
except Exception as e:
    logger.error(f"Could not connect to MongoDB: {e}")

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Get Emergent LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')


# ============================================
# MODELS
# ============================================

# Text Tool Models
class TextConvertRequest(BaseModel):
    text: str
    case_type: str

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
    from_format: str
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

# Unit Converter Models
class UnitConvertRequest(BaseModel):
    value: float
    from_unit: str
    to_unit: str
    category: str

# Generator Models
class UsernameGenerateRequest(BaseModel):
    style: str = "random"  # random, fantasy, business
    length: int = 8

class EmailGenerateRequest(BaseModel):
    name: str = ""
    domain: str = "example.com"

class BarcodeGenerateRequest(BaseModel):
    data: str
    barcode_type: str = "code128"

# Math Tools Models
class CalculatorRequest(BaseModel):
    expression: str

class PercentageRequest(BaseModel):
    value: float
    total: float
    operation: str = "what_percent"

class AgeCalculatorRequest(BaseModel):
    birth_date: str

# SEO Tools Models
class MetaTagsRequest(BaseModel):
    title: str
    description: str
    keywords: List[str]
    author: str = ""

# Developer Tools Models
class RegexTestRequest(BaseModel):
    pattern: str
    text: str
    flags: str = ""

class DiffCheckRequest(BaseModel):
    text1: str
    text2: str

class HashGenerateRequest(BaseModel):
    text: str
    algorithm: str = "sha256"

class TimestampRequest(BaseModel):
    timestamp: Optional[int] = None
    date_string: Optional[str] = None

# AI Tools Models
class AITextRequest(BaseModel):
    text: str
    operation: str  # paraphrase, enhance, summarize

class AIImageRequest(BaseModel):
    prompt: str
    size: str = "1024x1024"


# ============================================
# ROUTES - TEXT TOOLS
# ============================================

@api_router.get("/")
async def root():
    return {"message": "Toolbox API v2"}

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


# ============================================
# ROUTES - COLOR TOOLS
# ============================================

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
    
    if from_format == "hex":
        r, g, b = hex_to_rgb(color)
    elif from_format in ["rgb", "rgba"]:
        parts = color.replace("rgb(", "").replace("rgba(", "").replace(")", "").split(",")
        r, g, b = int(parts[0]), int(parts[1]), int(parts[2])
    
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
    if req.base_color:
        base = req.base_color.lstrip('#')
        r, g, b = tuple(int(base[i:i+2], 16) for i in (0, 2, 4))
    else:
        r, g, b = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
    
    palette = []
    for i in range(req.count):
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


# ============================================
# ROUTES - CSS TOOLS
# ============================================

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


# ============================================
# ROUTES - MISC TOOLS
# ============================================

@api_router.post("/tools/misc/qrcode")
async def generate_qr_code(req: QRCodeRequest):
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(req.text)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
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


# ============================================
# ROUTES - CODE TOOLS
# ============================================

@api_router.post("/tools/code/json-format")
async def format_json(data: dict):
    try:
        formatted = json.dumps(data.get("json_str"), indent=2)
        return {"result": formatted}
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON")


# ============================================
# ROUTES - UNIT CONVERTERS
# ============================================

@api_router.post("/tools/convert/units")
async def convert_units(req: UnitConvertRequest):
    category = req.category
    value = req.value
    from_unit = req.from_unit
    to_unit = req.to_unit
    
    conversions = {
        "length": {
            "meter": 1,
            "kilometer": 0.001,
            "centimeter": 100,
            "millimeter": 1000,
            "mile": 0.000621371,
            "yard": 1.09361,
            "foot": 3.28084,
            "inch": 39.3701
        },
        "weight": {
            "kilogram": 1,
            "gram": 1000,
            "milligram": 1000000,
            "pound": 2.20462,
            "ounce": 35.274
        },
        "temperature": {
            "celsius": lambda c: c,
            "fahrenheit": lambda c: (c * 9/5) + 32,
            "kelvin": lambda c: c + 273.15
        },
        "data": {
            "byte": 1,
            "kilobyte": 0.001,
            "megabyte": 0.000001,
            "gigabyte": 0.000000001,
            "terabyte": 0.000000000001
        }
    }
    
    if category == "temperature":
        if from_unit == "celsius":
            celsius_value = value
        elif from_unit == "fahrenheit":
            celsius_value = (value - 32) * 5/9
        elif from_unit == "kelvin":
            celsius_value = value - 273.15
        
        result = conversions[category][to_unit](celsius_value)
    else:
        conversion_table = conversions.get(category, {})
        base_value = value / conversion_table.get(from_unit, 1)
        result = base_value * conversion_table.get(to_unit, 1)
    
    return {"result": round(result, 6)}


# ============================================
# ROUTES - GENERATORS
# ============================================

@api_router.post("/tools/generate/username")
async def generate_username(req: UsernameGenerateRequest):
    if req.style == "random":
        chars = string.ascii_lowercase + string.digits
        username = "".join(random.choice(chars) for _ in range(req.length))
    elif req.style == "fantasy":
        prefixes = ["dark", "shadow", "fire", "ice", "storm", "blade", "moon", "star"]
        suffixes = ["walker", "rider", "hunter", "mage", "lord", "keeper", "slayer"]
        username = random.choice(prefixes) + random.choice(suffixes) + str(random.randint(1, 999))
    else:  # business
        first = ["john", "jane", "alex", "chris", "sam", "jordan", "taylor"]
        last = ["smith", "johnson", "williams", "brown", "jones"]
        username = random.choice(first) + "." + random.choice(last) + str(random.randint(1, 99))
    
    return {"username": username}

@api_router.post("/tools/generate/email")
async def generate_email(req: EmailGenerateRequest):
    if req.name:
        local_part = req.name.lower().replace(" ", ".")
    else:
        local_part = "user" + str(random.randint(1000, 9999))
    
    email = f"{local_part}@{req.domain}"
    return {"email": email}

@api_router.post("/tools/generate/barcode")
async def generate_barcode_image(req: BarcodeGenerateRequest):
    try:
        CODE128 = barcode.get_barcode_class('code128')
        barcode_instance = CODE128(req.data, writer=ImageWriter())
        
        buffer = io.BytesIO()
        barcode_instance.write(buffer)
        buffer.seek(0)
        
        img_base64 = base64.b64encode(buffer.read()).decode()
        return {"image": f"data:image/png;base64,{img_base64}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============================================
# ROUTES - MATH TOOLS
# ============================================

@api_router.post("/tools/math/calculate")
async def calculate(req: CalculatorRequest):
    try:
        result = eval(req.expression)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid expression")

@api_router.post("/tools/math/percentage")
async def calculate_percentage(req: PercentageRequest):
    if req.operation == "what_percent":
        result = (req.value / req.total) * 100
    elif req.operation == "percent_of":
        result = (req.value / 100) * req.total
    else:
        result = 0
    
    return {"result": round(result, 2)}

@api_router.post("/tools/math/age")
async def calculate_age(req: AgeCalculatorRequest):
    try:
        birth_date = datetime.fromisoformat(req.birth_date)
        today = datetime.now()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        
        months = (today.year - birth_date.year) * 12 + today.month - birth_date.month
        days = (today - birth_date).days
        
        return {
            "years": age,
            "months": months,
            "days": days
        }
    except:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")


# ============================================
# ROUTES - SEO/MARKETING TOOLS
# ============================================

@api_router.post("/tools/seo/meta-tags")
async def generate_meta_tags(req: MetaTagsRequest):
    html = f"""<title>{req.title}</title>
<meta name="description" content="{req.description}">
<meta name="keywords" content="{', '.join(req.keywords)}">"""
    
    if req.author:
        html += f'\n<meta name="author" content="{req.author}">'
    
    return {"html": html}

@api_router.post("/tools/seo/open-graph")
async def generate_open_graph(title: str, description: str, image: str = "", url: str = ""):
    og_tags = f"""<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">"""
    
    if image:
        og_tags += f'\n<meta property="og:image" content="{image}">'
    if url:
        og_tags += f'\n<meta property="og:url" content="{url}">'
    
    return {"html": og_tags}


# ============================================
# ROUTES - DEVELOPER TOOLS
# ============================================

@api_router.post("/tools/dev/regex-test")
async def test_regex(req: RegexTestRequest):
    try:
        pattern = re.compile(req.pattern)
        matches = pattern.findall(req.text)
        is_match = bool(pattern.search(req.text))
        
        return {
            "is_match": is_match,
            "matches": matches,
            "match_count": len(matches)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid regex: {str(e)}")

@api_router.post("/tools/dev/diff")
async def check_diff(req: DiffCheckRequest):
    lines1 = req.text1.split('\n')
    lines2 = req.text2.split('\n')
    
    differences = []
    max_lines = max(len(lines1), len(lines2))
    
    for i in range(max_lines):
        line1 = lines1[i] if i < len(lines1) else ""
        line2 = lines2[i] if i < len(lines2) else ""
        
        if line1 != line2:
            differences.append({
                "line": i + 1,
                "text1": line1,
                "text2": line2
            })
    
    return {"differences": differences, "total_differences": len(differences)}

@api_router.post("/tools/dev/hash")
async def generate_hash(req: HashGenerateRequest):
    text_bytes = req.text.encode('utf-8')
    
    algorithms = {
        "md5": hashlib.md5,
        "sha1": hashlib.sha1,
        "sha256": hashlib.sha256,
        "sha512": hashlib.sha512
    }
    
    hash_func = algorithms.get(req.algorithm.lower())
    if not hash_func:
        raise HTTPException(status_code=400, detail="Unsupported algorithm")
    
    result = hash_func(text_bytes).hexdigest()
    return {"hash": result}

@api_router.post("/tools/dev/timestamp")
async def convert_timestamp(req: TimestampRequest):
    if req.timestamp:
        dt = datetime.fromtimestamp(req.timestamp)
        return {
            "timestamp": req.timestamp,
            "datetime": dt.isoformat(),
            "human_readable": dt.strftime("%Y-%m-%d %H:%M:%S")
        }
    elif req.date_string:
        dt = datetime.fromisoformat(req.date_string)
        return {
            "timestamp": int(dt.timestamp()),
            "datetime": dt.isoformat(),
            "human_readable": dt.strftime("%Y-%m-%d %H:%M:%S")
        }
    else:
        now = datetime.now()
        return {
            "timestamp": int(now.timestamp()),
            "datetime": now.isoformat(),
            "human_readable": now.strftime("%Y-%m-%d %H:%M:%S")
        }


# ============================================
# ROUTES - AI TOOLS
# ============================================

@api_router.post("/tools/ai/text")
async def ai_text_tool(req: AITextRequest):
    if not HAS_EMERGENT:
        raise HTTPException(status_code=501, detail="AI text tool requires emergentintegrations package which is not installed")
    
    try:
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="AI key not configured")
        
        system_messages = {
            "paraphrase": "You are a paraphrasing assistant. Rewrite the given text while maintaining its meaning. Return only the paraphrased text.",
            "enhance": "You are a text enhancement assistant. Improve the given text for clarity, grammar, and style. Return only the enhanced text.",
            "summarize": "You are a summarization assistant. Create a concise summary of the given text. Return only the summary."
        }
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message=system_messages.get(req.operation, "You are a helpful assistant.")
        ).with_model("openai", "gpt-4o-mini")
        
        user_message = UserMessage(text=req.text)
        response = await chat.send_message(user_message)
        
        return {"result": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/tools/ai/image")
async def ai_image_generator(req: AIImageRequest):
    try:
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="AI key not configured")
        
        from openai import OpenAI
        
        openai_client = OpenAI(api_key=EMERGENT_LLM_KEY)
        
        response = openai_client.images.generate(
            model="dall-e-3",
            prompt=req.prompt,
            size=req.size,
            n=1
        )
        
        image_url = response.data[0].url
        
        return {"image_url": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# INCLUDE ROUTER & MIDDLEWARE
# ============================================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()
