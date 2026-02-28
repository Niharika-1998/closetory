import requests
import sys
import json
from datetime import datetime

class ClosetoryAPITester:
    def __init__(self, base_url="https://closet-story.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.session_token:
            test_headers['Authorization'] = f'Bearer {self.session_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_body": response.text[:500] if response.text else ""
            }
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    json_response = response.json()
                    result["response_data"] = json_response
                    return True, json_response
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                result["error_message"] = response.text
                self.test_results.append(result)
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "success": False,
                "error": str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_public_endpoints(self):
        """Test all public endpoints"""
        print("\n" + "="*50)
        print("TESTING PUBLIC ENDPOINTS")
        print("="*50)
        
        # Test get all products
        success, products = self.run_test(
            "Get All Products",
            "GET",
            "/products",
            200
        )
        
        # Test get all designers
        success, designers = self.run_test(
            "Get All Designers",
            "GET",
            "/designers",
            200
        )
        
        # Test product filtering
        self.run_test(
            "Filter Products by Category",
            "GET",
            "/products?category=Dresses",
            200
        )
        
        self.run_test(
            "Filter Products by Occasion",
            "GET",
            "/products?occasion=wedding",
            200
        )
        
        # Test individual product (use first product if available)
        if products and len(products) > 0:
            product_id = products[0]['product_id']
            self.run_test(
                "Get Single Product",
                "GET",
                f"/products/{product_id}",
                200
            )
        
        # Test individual designer (use first designer if available)  
        if designers and len(designers) > 0:
            designer_id = designers[0]['designer_id']
            self.run_test(
                "Get Single Designer",
                "GET", 
                f"/designers/{designer_id}",
                200
            )
        
        # Test newsletter signup
        test_email = f"test.newsletter.{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com"
        self.run_test(
            "Newsletter Signup",
            "POST",
            f"/newsletter?email={test_email}",
            200
        )
        
        return products, designers

    def test_auth_endpoints_without_token(self):
        """Test auth endpoints without token (should fail)"""
        print("\n" + "="*50)
        print("TESTING PROTECTED ENDPOINTS (WITHOUT AUTH)")
        print("="*50)
        
        # These should all return 401
        self.run_test("Get Profile (No Auth)", "GET", "/auth/me", 401)
        self.run_test("Get Wishlist (No Auth)", "GET", "/wishlist", 401) 
        self.run_test("Get Cart (No Auth)", "GET", "/cart", 401)

    def test_auth_endpoints_with_token(self, products):
        """Test auth endpoints with valid token"""
        if not self.session_token:
            print("\n❌ No session token available, skipping authenticated tests")
            return
            
        print("\n" + "="*50)
        print("TESTING PROTECTED ENDPOINTS (WITH AUTH)")
        print("="*50)
        
        # Test getting user profile
        success, user_data = self.run_test("Get User Profile", "GET", "/auth/me", 200)
        if success and user_data:
            self.user_id = user_data.get('user_id')
            print(f"   User ID: {self.user_id}")
        
        # Test wishlist operations
        self.run_test("Get Empty Wishlist", "GET", "/wishlist", 200)
        
        if products and len(products) > 0:
            product_id = products[0]['product_id']
            
            # Test add to wishlist
            self.run_test("Add to Wishlist", "POST", f"/wishlist/{product_id}", 200)
            
            # Test get wishlist (should have item)
            self.run_test("Get Wishlist with Item", "GET", "/wishlist", 200)
            
            # Test remove from wishlist
            self.run_test("Remove from Wishlist", "DELETE", f"/wishlist/{product_id}", 200)
        
        # Test cart operations
        self.run_test("Get Empty Cart", "GET", "/cart", 200)
        
        if products and len(products) > 0:
            product_id = products[0]['product_id']
            
            # Test add to cart
            self.run_test("Add to Cart", "POST", f"/cart/{product_id}", 200)
            
            # Test get cart (should have item)
            self.run_test("Get Cart with Item", "GET", "/cart", 200)
            
            # Test checkout (create order)
            success, order = self.run_test("Create Order", "POST", "/orders", 200)
            
            if success and order:
                print(f"   Order ID: {order.get('order_id')}")
                print(f"   Order Total: ₹{order.get('total', 0)}")
        
        # Test logout
        self.run_test("Logout", "POST", "/auth/logout", 200)

    def create_test_session(self):
        """Create a test user and session using mongosh"""
        print("\n" + "="*50)
        print("CREATING TEST USER AND SESSION")
        print("="*50)
        
        import subprocess
        import random
        
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        test_user_id = f"test-user-{timestamp}"
        test_session_token = f"test_session_{timestamp}_{random.randint(1000,9999)}"
        test_email = f"test.user.{timestamp}@example.com"
        
        mongosh_command = f"""
        use('test_database');
        db.users.insertOne({{
          user_id: '{test_user_id}',
          email: '{test_email}',
          name: 'Test User {timestamp}',
          picture: 'https://via.placeholder.com/150',
          created_at: new Date()
        }});
        db.user_sessions.insertOne({{
          user_id: '{test_user_id}',
          session_token: '{test_session_token}',
          expires_at: new Date(Date.now() + 7*24*60*60*1000),
          created_at: new Date()
        }});
        print('SUCCESS: Test user and session created');
        """
        
        try:
            result = subprocess.run(
                ['mongosh', '--eval', mongosh_command],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                print(f"✅ Test user created successfully")
                print(f"   User ID: {test_user_id}")
                print(f"   Session Token: {test_session_token}")
                print(f"   Email: {test_email}")
                self.session_token = test_session_token
                self.user_id = test_user_id
                return True
            else:
                print(f"❌ Failed to create test user: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error creating test user: {str(e)}")
            return False

    def cleanup_test_data(self):
        """Clean up test data"""
        if not self.user_id:
            return
            
        print("\n" + "="*50)
        print("CLEANING UP TEST DATA")
        print("="*50)
        
        import subprocess
        
        cleanup_command = f"""
        use('test_database');
        db.users.deleteMany({{email: /test\.user\./}});
        db.user_sessions.deleteMany({{session_token: /test_session/}});
        db.wishlist.deleteMany({{user_id: /test-user-/}});
        db.cart.deleteMany({{user_id: /test-user-/}});
        db.orders.deleteMany({{user_id: /test-user-/}});
        db.newsletter.deleteMany({{email: /test\.newsletter\./}});
        print('SUCCESS: Test data cleaned up');
        """
        
        try:
            result = subprocess.run(
                ['mongosh', '--eval', cleanup_command],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                print("✅ Test data cleaned up successfully")
            else:
                print(f"⚠️  Cleanup warning: {result.stderr}")
                
        except Exception as e:
            print(f"⚠️  Cleanup error: {str(e)}")

def main():
    print("🚀 Starting Closetory API Testing")
    tester = ClosetoryAPITester()
    
    try:
        # Test public endpoints first
        products, designers = tester.test_public_endpoints()
        
        # Test auth endpoints without token (should fail)
        tester.test_auth_endpoints_without_token()
        
        # Create test user and session
        if tester.create_test_session():
            # Test auth endpoints with token
            tester.test_auth_endpoints_with_token(products)
        else:
            print("❌ Could not create test session, skipping authenticated tests")
        
        # Print final results
        print("\n" + "="*50)
        print("FINAL TEST RESULTS")
        print("="*50)
        print(f"📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
        print(f"📊 Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
        
        if tester.test_results:
            print(f"\n❌ Failed tests:")
            for result in tester.test_results:
                if not result.get('success', False):
                    print(f"   - {result['test_name']}: {result.get('error_message', result.get('error', 'Unknown error'))}")
        
        return 0 if tester.tests_passed == tester.tests_run else 1
        
    except KeyboardInterrupt:
        print("\n⏹️  Testing interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        return 1
    finally:
        # Always try to cleanup
        tester.cleanup_test_data()

if __name__ == "__main__":
    sys.exit(main())