import requests
import json
import sys
from datetime import datetime

class APITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}: {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            
            # Try to get JSON response, but handle case where response is not JSON
            try:
                response_data = response.json()
                response_str = json.dumps(response_data, indent=2)
            except:
                response_data = {}
                response_str = response.text
            
            result = {
                "name": name,
                "method": method,
                "url": url,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response": response_data
            }
            
            self.results.append(result)
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                print(f"Response: {response_str}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response_str}")

            return success, response_data

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.results.append({
                "name": name,
                "method": method,
                "url": url,
                "expected_status": expected_status,
                "success": False,
                "error": str(e)
            })
            return False, {}

    def print_summary(self):
        """Print a summary of all test results"""
        print("\n" + "="*50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        print("="*50)
        
        for result in self.results:
            status = "✅" if result.get("success") else "❌"
            print(f"{status} {result.get('name')}: {result.get('method')} {result.get('url')}")
            if not result.get("success"):
                if "error" in result:
                    print(f"   Error: {result.get('error')}")
                else:
                    print(f"   Expected status: {result.get('expected_status')}, got: {result.get('actual_status')}")
        
        print("="*50)
        return self.tests_passed == self.tests_run

def main():
    # Get the backend URL from the frontend .env file
    backend_url = "https://5d1b2ebb-ba31-4c61-9725-4b6170cc072c.preview.emergentagent.com"
    
    print(f"🚀 Testing API at {backend_url}")
    tester = APITester(backend_url)
    
    # Test root endpoint
    tester.run_test("Root Endpoint", "GET", "", 200)
    
    # Test health endpoint
    tester.run_test("Health Check", "GET", "health", 200)
    
    # Test creating a status check
    client_name = f"test_client_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    success, response = tester.run_test(
        "Create Status Check", 
        "POST", 
        "status", 
        200, 
        data={"client_name": client_name}
    )
    
    # Test getting status checks
    tester.run_test("Get Status Checks", "GET", "status", 200)
    
    # Print summary
    success = tester.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())