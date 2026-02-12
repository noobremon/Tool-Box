import requests
import sys
import json
from datetime import datetime

class ToolboxAPITester:
    def __init__(self, base_url="https://devtoolbox-3.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, params=params)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")
                self.failed_tests.append({
                    'name': name,
                    'endpoint': endpoint,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'error': response.text
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'endpoint': endpoint,
                'error': str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_text_tools(self):
        """Test all text tool endpoints"""
        print("\n📝 Testing Text Tools...")
        
        # Case Converter
        self.run_test(
            "Case Converter - Upper",
            "POST",
            "tools/text/convert",
            200,
            {"text": "hello world", "case_type": "upper"}
        )
        
        self.run_test(
            "Case Converter - CamelCase",
            "POST",
            "tools/text/convert",
            200,
            {"text": "hello world test", "case_type": "camel"}
        )
        
        # Word Counter
        self.run_test(
            "Word Counter",
            "POST",
            "tools/text/wordcount",
            200,
            {"text": "Hello world! This is a test sentence with multiple words."}
        )
        
        # Lorem Ipsum
        self.run_test(
            "Lorem Ipsum Generator",
            "POST",
            "tools/text/lorem",
            200,
            {"paragraphs": 2}
        )
        
        # Base64 Converter
        self.run_test(
            "Base64 Encode",
            "POST",
            "tools/text/base64",
            200,
            {"text": "Hello World", "encode": True}
        )
        
        self.run_test(
            "Base64 Decode",
            "POST",
            "tools/text/base64",
            200,
            {"text": "SGVsbG8gV29ybGQ=", "encode": False}
        )
        
        # URL Encoder
        self.run_test(
            "URL Encode",
            "POST",
            "tools/text/url-encode",
            200,
            {"text": "hello world & test", "encode": True}
        )

    def test_color_tools(self):
        """Test all color tool endpoints"""
        print("\n🎨 Testing Color Tools...")
        
        # Color Converter
        self.run_test(
            "Color Converter - HEX to RGB",
            "POST",
            "tools/color/convert",
            200,
            {"color": "#3b82f6", "from_format": "hex", "to_format": "rgb"}
        )
        
        # Palette Generator
        self.run_test(
            "Palette Generator",
            "POST",
            "tools/color/palette",
            200,
            {"base_color": "#3b82f6", "count": 5}
        )
        
        # Shades Generator
        self.run_test(
            "Shades Generator",
            "POST",
            "tools/color/shades",
            200,
            {"color": "#3b82f6", "count": 10}
        )

    def test_css_tools(self):
        """Test all CSS tool endpoints"""
        print("\n🎨 Testing CSS Tools...")
        
        # Gradient Generator
        self.run_test(
            "Gradient Generator",
            "POST",
            "tools/css/gradient",
            200,
            {"colors": ["#3b82f6", "#10b981"], "direction": "to right"}
        )
        
        # Box Shadow Generator
        self.run_test(
            "Box Shadow Generator",
            "POST",
            "tools/css/box-shadow",
            200,
            {"h_offset": 0, "v_offset": 5, "blur": 10, "spread": 0, "color": "rgba(0,0,0,0.3)"}
        )
        
        # Border Radius Generator
        self.run_test(
            "Border Radius Generator",
            "POST",
            "tools/css/border-radius",
            200,
            params={"tl": 10, "tr": 20, "br": 30, "bl": 40}
        )
        
        # Glassmorphism Generator
        self.run_test(
            "Glassmorphism Generator",
            "POST",
            "tools/css/glassmorphism",
            200,
            params={"blur": 15, "opacity": 0.4}
        )

    def test_misc_tools(self):
        """Test all miscellaneous tool endpoints"""
        print("\n🔧 Testing Miscellaneous Tools...")
        
        # QR Code Generator
        self.run_test(
            "QR Code Generator",
            "POST",
            "tools/misc/qrcode",
            200,
            {"text": "https://example.com", "size": 300}
        )
        
        # Password Generator
        self.run_test(
            "Password Generator",
            "POST",
            "tools/misc/password",
            200,
            {
                "length": 16,
                "include_uppercase": True,
                "include_lowercase": True,
                "include_numbers": True,
                "include_symbols": True
            }
        )
        
        # List Shuffler
        self.run_test(
            "List Shuffler",
            "POST",
            "tools/misc/shuffle",
            200,
            {"items": ["apple", "banana", "cherry", "date"]}
        )
        
        # UUID Generator
        self.run_test(
            "UUID Generator",
            "GET",
            "tools/misc/uuid",
            200
        )

    def test_code_tools(self):
        """Test code tool endpoints"""
        print("\n💻 Testing Code Tools...")
        
        # JSON Formatter
        test_json = {"name": "test", "value": 123, "nested": {"key": "value"}}
        self.run_test(
            "JSON Formatter",
            "POST",
            "tools/code/json-format",
            200,
            {"json_str": test_json}
        )

def main():
    print("🚀 Starting Toolbox API Tests...")
    print("=" * 50)
    
    tester = ToolboxAPITester()
    
    # Test root endpoint first
    success, _ = tester.test_root_endpoint()
    if not success:
        print("❌ Root API endpoint failed, stopping tests")
        return 1
    
    # Test all tool categories
    tester.test_text_tools()
    tester.test_color_tools()
    tester.test_css_tools()
    tester.test_misc_tools()
    tester.test_code_tools()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for test in tester.failed_tests:
            print(f"   - {test['name']}: {test.get('error', 'Status code mismatch')}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())