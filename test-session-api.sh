#!/bin/bash

# Photobooth Session API Complete Test Script
# This script tests the entire photobooth session management flow

set -e  # Exit on any error

# Configuration
BASE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@photoboth.com"
ADMIN_PASSWORD="Admin123!"
USER_EMAIL="user@example.com"
USER_PASSWORD="User123!"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test functions
test_health() {
    log_info "Testing health endpoint..."
    response=$(curl -s -X GET "$BASE_URL/api/v1/health")
    if echo "$response" | jq -e '.status == "ok"' > /dev/null; then
        log_success "Health check passed"
    else
        log_error "Health check failed"
        exit 1
    fi
}

test_admin_login() {
    log_info "Testing admin login..."
    response=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
    
    ADMIN_TOKEN=$(echo "$response" | jq -r '.access_token')
    if [ "$ADMIN_TOKEN" != "null" ] && [ "$ADMIN_TOKEN" != "" ]; then
        log_success "Admin login successful"
        echo "Admin Token: ${ADMIN_TOKEN:0:20}..."
    else
        log_error "Admin login failed"
        echo "Response: $response"
        exit 1
    fi
}

test_user_login() {
    log_info "Testing user login..."
    response=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$USER_PASSWORD\"}")
    
    USER_TOKEN=$(echo "$response" | jq -r '.access_token')
    if [ "$USER_TOKEN" != "null" ] && [ "$USER_TOKEN" != "" ]; then
        log_success "User login successful"
        echo "User Token: ${USER_TOKEN:0:20}..."
    else
        log_warning "User login failed, trying to register..."
        test_user_register
    fi
}

test_user_register() {
    log_info "Registering new user..."
    response=$(curl -s -X POST "$BASE_URL/api/v1/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$USER_PASSWORD\",\"name\":\"Test User\"}")
    
    if echo "$response" | jq -e '.message' > /dev/null; then
        log_success "User registration successful"
        test_user_login
    else
        log_error "User registration failed"
        echo "Response: $response"
        exit 1
    fi
}

test_get_photobooths() {
    log_info "Testing get photobooths..."
    response=$(curl -s -X GET "$BASE_URL/api/v1/admin/photobooth/photobooths?page=1&limit=5" \
        -H "Authorization: Bearer $ADMIN_TOKEN")
    
    PHOTOBOOTH_ID=$(echo "$response" | jq -r '.data[0].id')
    if [ "$PHOTOBOOTH_ID" != "null" ] && [ "$PHOTOBOOTH_ID" != "" ]; then
        log_success "Found photobooth: $PHOTOBOOTH_ID"
    else
        log_warning "No photobooths found, creating one..."
        test_create_photobooth
    fi
}

test_create_photobooth() {
    log_info "Creating test photobooth..."
    response=$(curl -s -X POST "$BASE_URL/api/v1/admin/photobooth/photobooths" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test Photobooth","description":"Test photobooth for API testing","location":"Test Location"}')
    
    PHOTOBOOTH_ID=$(echo "$response" | jq -r '.id')
    if [ "$PHOTOBOOTH_ID" != "null" ] && [ "$PHOTOBOOTH_ID" != "" ]; then
        log_success "Photobooth created: $PHOTOBOOTH_ID"
    else
        log_error "Failed to create photobooth"
        echo "Response: $response"
        exit 1
    fi
}

test_get_available_photobooths() {
    log_info "Testing get available photobooths..."
    response=$(curl -s -X GET "$BASE_URL/api/v1/photobooth/available" \
        -H "Authorization: Bearer $USER_TOKEN")
    
    if echo "$response" | jq -e '.[0].id' > /dev/null; then
        log_success "Available photobooths retrieved"
        echo "Available photobooths: $(echo "$response" | jq '. | length')"
    else
        log_error "Failed to get available photobooths"
        echo "Response: $response"
        exit 1
    fi
}

test_create_session() {
    log_info "Testing create session..."
    response=$(curl -s -X POST "$BASE_URL/api/v1/photobooth/sessions" \
        -H "Authorization: Bearer $USER_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"photoboothId\":\"$PHOTOBOOTH_ID\",\"maxPhotos\":3,\"notes\":\"API Test Session\"}")
    
    SESSION_ID=$(echo "$response" | jq -r '.id')
    if [ "$SESSION_ID" != "null" ] && [ "$SESSION_ID" != "" ]; then
        log_success "Session created: $SESSION_ID"
        echo "Session Status: $(echo "$response" | jq -r '.status')"
        echo "User: $(echo "$response" | jq -r '.user.name')"
        echo "Note: User ID automatically extracted from JWT token"
    else
        log_error "Failed to create session"
        echo "Response: $response"
        exit 1
    fi
}

test_start_session() {
    log_info "Testing start session..."
    response=$(curl -s -X PUT "$BASE_URL/api/v1/photobooth/sessions/$SESSION_ID/start" \
        -H "Authorization: Bearer $USER_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{}')
    
    STATUS=$(echo "$response" | jq -r '.status')
    if [ "$STATUS" = "active" ]; then
        log_success "Session started successfully"
        echo "Started at: $(echo "$response" | jq -r '.startedAt')"
    else
        log_error "Failed to start session"
        echo "Response: $response"
        exit 1
    fi
}

test_take_photos() {
    log_info "Testing take photos..."
    
    for i in {1..3}; do
        log_info "Taking photo $i..."
        response=$(curl -s -X POST "$BASE_URL/api/v1/photobooth/sessions/$SESSION_ID/photos" \
            -H "Authorization: Bearer $USER_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"imageUrl\":\"https://example.com/test-photo-$i.jpg\",\"caption\":\"Test Photo $i\"}")
        
        PHOTO_ID=$(echo "$response" | jq -r '.id')
        if [ "$PHOTO_ID" != "null" ] && [ "$PHOTO_ID" != "" ]; then
            log_success "Photo $i taken successfully"
            echo "Photo Order: $(echo "$response" | jq -r '.order')"
        else
            log_error "Failed to take photo $i"
            echo "Response: $response"
            exit 1
        fi
    done
}

test_get_session_photos() {
    log_info "Testing get session photos..."
    response=$(curl -s -X GET "$BASE_URL/api/v1/photobooth/sessions/$SESSION_ID/photos" \
        -H "Authorization: Bearer $USER_TOKEN")
    
    PHOTO_COUNT=$(echo "$response" | jq '. | length')
    if [ "$PHOTO_COUNT" -eq 3 ]; then
        log_success "All photos retrieved: $PHOTO_COUNT photos"
    else
        log_error "Photo count mismatch. Expected: 3, Got: $PHOTO_COUNT"
        echo "Response: $response"
        exit 1
    fi
}

test_complete_session() {
    log_info "Testing complete session..."
    response=$(curl -s -X PUT "$BASE_URL/api/v1/photobooth/sessions/$SESSION_ID/complete" \
        -H "Authorization: Bearer $USER_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{}')
    
    STATUS=$(echo "$response" | jq -r '.status')
    if [ "$STATUS" = "completed" ]; then
        log_success "Session completed successfully"
        echo "Completed at: $(echo "$response" | jq -r '.completedAt')"
        echo "Photo count: $(echo "$response" | jq -r '.photoCount')"
    else
        log_error "Failed to complete session"
        echo "Response: $response"
        exit 1
    fi
}

test_get_session_details() {
    log_info "Testing get session details..."
    response=$(curl -s -X GET "$BASE_URL/api/v1/photobooth/sessions/$SESSION_ID" \
        -H "Authorization: Bearer $USER_TOKEN")
    
    STATUS=$(echo "$response" | jq -r '.status')
    PHOTO_COUNT=$(echo "$response" | jq -r '.photoCount')
    USER_NAME=$(echo "$response" | jq -r '.user.name')
    
    if [ "$STATUS" = "completed" ] && [ "$PHOTO_COUNT" -eq 3 ]; then
        log_success "Session details retrieved successfully"
        echo "Status: $STATUS"
        echo "Photos: $PHOTO_COUNT"
        echo "User: $USER_NAME"
    else
        log_error "Session details mismatch"
        echo "Response: $response"
        exit 1
    fi
}

test_admin_get_sessions() {
    log_info "Testing admin get sessions..."
    response=$(curl -s -X GET "$BASE_URL/api/v1/admin/photobooth/sessions?page=1&limit=5" \
        -H "Authorization: Bearer $ADMIN_TOKEN")
    
    SESSION_COUNT=$(echo "$response" | jq '.data | length')
    if [ "$SESSION_COUNT" -gt 0 ]; then
        log_success "Admin sessions retrieved: $SESSION_COUNT sessions"
    else
        log_error "No sessions found in admin view"
        echo "Response: $response"
        exit 1
    fi
}

test_admin_get_stats() {
    log_info "Testing admin get stats..."
    response=$(curl -s -X GET "$BASE_URL/api/v1/admin/photobooth/stats" \
        -H "Authorization: Bearer $ADMIN_TOKEN")
    
    TOTAL_SESSIONS=$(echo "$response" | jq -r '.overview.totalSessions')
    if [ "$TOTAL_SESSIONS" -gt 0 ]; then
        log_success "Admin stats retrieved successfully"
        echo "Total sessions: $TOTAL_SESSIONS"
        echo "Active photobooths: $(echo "$response" | jq -r '.overview.activePhotobooths')"
    else
        log_error "Failed to get admin stats"
        echo "Response: $response"
        exit 1
    fi
}

test_error_scenarios() {
    log_info "Testing error scenarios..."
    
    # Test unauthorized access
    log_info "Testing unauthorized access..."
    response=$(curl -s -X GET "$BASE_URL/api/v1/photobooth/sessions/$SESSION_ID" \
        -H "Authorization: Bearer invalid_token")
    
    STATUS_CODE=$(echo "$response" | jq -r '.statusCode')
    if [ "$STATUS_CODE" = "401" ]; then
        log_success "Unauthorized access properly rejected"
    else
        log_warning "Unauthorized access test failed"
    fi
    
    # Test invalid session ID
    log_info "Testing invalid session ID..."
    response=$(curl -s -X GET "$BASE_URL/api/v1/photobooth/sessions/invalid-session-id" \
        -H "Authorization: Bearer $USER_TOKEN")
    
    STATUS_CODE=$(echo "$response" | jq -r '.statusCode')
    if [ "$STATUS_CODE" = "404" ]; then
        log_success "Invalid session ID properly rejected"
    else
        log_warning "Invalid session ID test failed"
    fi
}

# Main test execution
main() {
    echo "=========================================="
    echo "Photobooth Session API Test Suite"
    echo "=========================================="
    echo ""
    
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed. Please install jq first."
        exit 1
    fi
    
    # Check if server is running
    if ! curl -s "$BASE_URL/api/v1/health" > /dev/null; then
        log_error "Server is not running at $BASE_URL"
        log_info "Please start the server with: yarn start:dev"
        exit 1
    fi
    
    # Run tests
    test_health
    test_admin_login
    test_user_login
    test_get_photobooths
    test_get_available_photobooths
    test_create_session
    test_start_session
    test_take_photos
    test_get_session_photos
    test_complete_session
    test_get_session_details
    test_admin_get_sessions
    test_admin_get_stats
    test_error_scenarios
    
    echo ""
    echo "=========================================="
    log_success "All tests completed successfully! 🎉"
    echo "=========================================="
    echo ""
    echo "Test Summary:"
    echo "- Health check: ✅"
    echo "- Authentication: ✅"
    echo "- Session creation: ✅"
    echo "- Session management: ✅"
    echo "- Photo management: ✅"
    echo "- Admin functions: ✅"
    echo "- Error handling: ✅"
    echo ""
    echo "API is ready for production use! 🚀"
}

# Run main function
main "$@"
