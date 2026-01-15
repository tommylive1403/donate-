#!/usr/bin/env python3
"""
Backend API Testing for Fundraising Application
Tests all fundraising endpoints according to test_result.md priorities
"""

import requests
import json
import os
from datetime import datetime

# Get backend URL from frontend .env file
BACKEND_URL = "https://combat-aid.preview.emergentagent.com/api"
ADMIN_PASSWORD = "admin123"

def test_get_fundraising():
    """Test GET /api/fundraising endpoint"""
    print("\n=== Testing GET /api/fundraising ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/fundraising", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ GET request successful")
            print(f"Response data: {json.dumps(data, indent=2, default=str)}")
            
            # Validate expected structure
            required_fields = ['totalRaised', 'goalAmount', 'donorCount', 'monobank', 'crypto', 'social']
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False
            
            # Validate nested structures
            monobank_fields = ['link', 'cardNumber', 'iban']
            crypto_fields = ['usdt_trc20']
            social_fields = ['instagram', 'facebook']
            
            monobank_missing = [field for field in monobank_fields if field not in data.get('monobank', {})]
            crypto_missing = [field for field in crypto_fields if field not in data.get('crypto', {})]
            social_missing = [field for field in social_fields if field not in data.get('social', {})]
            
            if monobank_missing or crypto_missing or social_missing:
                print(f"❌ Missing nested fields - monobank: {monobank_missing}, crypto: {crypto_missing}, social: {social_missing}")
                return False
            
            # Check default values
            expected_total = 125000
            expected_goal = 500000
            expected_donors = 347
            
            if (data['totalRaised'] == expected_total and 
                data['goalAmount'] == expected_goal and 
                data['donorCount'] == expected_donors):
                print("✅ Default data values are correct")
            else:
                print(f"⚠️  Data values differ from expected defaults:")
                print(f"   Total: {data['totalRaised']} (expected: {expected_total})")
                print(f"   Goal: {data['goalAmount']} (expected: {expected_goal})")
                print(f"   Donors: {data['donorCount']} (expected: {expected_donors})")
            
            return True
        else:
            print(f"❌ GET request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_put_fundraising_valid_password():
    """Test PUT /api/fundraising with correct admin password"""
    print("\n=== Testing PUT /api/fundraising (Valid Password) ===")
    
    test_data = {
        "adminPassword": ADMIN_PASSWORD,
        "totalRaised": 150000,
        "goalAmount": 600000,
        "donorCount": 400,
        "monobank": {
            "link": "https://send.monobank.ua/jar/test123",
            "cardNumber": "5375 4141 9999 8888",
            "iban": "UA999888777666555444333222111"
        },
        "crypto": {
            "usdt_trc20": "TTestWalletAddress123456789012345"
        },
        "social": {
            "instagram": "https://instagram.com/test_unit",
            "facebook": "https://facebook.com/test_unit"
        }
    }
    
    try:
        response = requests.put(
            f"{BACKEND_URL}/fundraising", 
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ PUT request with valid password successful")
            print(f"Response: {json.dumps(data, indent=2, default=str)}")
            
            if data.get('success') and 'message' in data:
                print("✅ Response structure is correct")
                return True
            else:
                print("❌ Response structure is incorrect")
                return False
        else:
            print(f"❌ PUT request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_put_fundraising_invalid_password():
    """Test PUT /api/fundraising with incorrect admin password"""
    print("\n=== Testing PUT /api/fundraising (Invalid Password) ===")
    
    test_data = {
        "adminPassword": "wrongpassword",
        "totalRaised": 200000,
        "goalAmount": 700000,
        "donorCount": 500,
        "monobank": {
            "link": "https://send.monobank.ua/jar/hack123",
            "cardNumber": "1111 2222 3333 4444",
            "iban": "UA111222333444555666777888999"
        },
        "crypto": {
            "usdt_trc20": "THackAttempt123456789012345678"
        },
        "social": {
            "instagram": "https://instagram.com/hacker",
            "facebook": "https://facebook.com/hacker"
        }
    }
    
    try:
        response = requests.put(
            f"{BACKEND_URL}/fundraising", 
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ PUT request correctly rejected invalid password")
            print(f"Response: {response.text}")
            return True
        else:
            print(f"❌ PUT request should have returned 401, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_data_persistence():
    """Test that data updates persist by checking GET after PUT"""
    print("\n=== Testing Data Persistence ===")
    
    # First, update with known values
    update_data = {
        "adminPassword": ADMIN_PASSWORD,
        "totalRaised": 175000,
        "goalAmount": 550000,
        "donorCount": 375,
        "monobank": {
            "link": "https://send.monobank.ua/jar/persist123",
            "cardNumber": "5375 4141 7777 6666",
            "iban": "UA777666555444333222111000999"
        },
        "crypto": {
            "usdt_trc20": "TPersistenceTest123456789012345"
        },
        "social": {
            "instagram": "https://instagram.com/persist_unit",
            "facebook": "https://facebook.com/persist_unit"
        }
    }
    
    try:
        # Update data
        put_response = requests.put(
            f"{BACKEND_URL}/fundraising", 
            json=update_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if put_response.status_code != 200:
            print(f"❌ Failed to update data for persistence test: {put_response.status_code}")
            return False
        
        # Retrieve data
        get_response = requests.get(f"{BACKEND_URL}/fundraising", timeout=10)
        
        if get_response.status_code != 200:
            print(f"❌ Failed to retrieve data for persistence test: {get_response.status_code}")
            return False
        
        retrieved_data = get_response.json()
        
        # Check if updated values persist
        if (retrieved_data['totalRaised'] == update_data['totalRaised'] and
            retrieved_data['goalAmount'] == update_data['goalAmount'] and
            retrieved_data['donorCount'] == update_data['donorCount'] and
            retrieved_data['monobank']['link'] == update_data['monobank']['link']):
            print("✅ Data persistence test successful")
            return True
        else:
            print("❌ Data persistence test failed - values don't match")
            print(f"Expected totalRaised: {update_data['totalRaised']}, Got: {retrieved_data['totalRaised']}")
            return False
            
    except Exception as e:
        print(f"❌ Persistence test error: {e}")
        return False

def run_all_tests():
    """Run all fundraising API tests"""
    print("🚀 Starting Fundraising API Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Admin Password: {ADMIN_PASSWORD}")
    
    results = {}
    
    # Test 1: GET fundraising data
    results['get_fundraising'] = test_get_fundraising()
    
    # Test 2: PUT with valid password
    results['put_valid_password'] = test_put_fundraising_valid_password()
    
    # Test 3: PUT with invalid password
    results['put_invalid_password'] = test_put_fundraising_invalid_password()
    
    # Test 4: Data persistence
    results['data_persistence'] = test_data_persistence()
    
    # Summary
    print("\n" + "="*50)
    print("📊 TEST RESULTS SUMMARY")
    print("="*50)
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return True
    else:
        print("⚠️  Some tests failed!")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)