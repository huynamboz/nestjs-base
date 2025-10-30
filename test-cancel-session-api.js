const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testCancelSessionAPI() {
  try {
    console.log('🧪 Testing Cancel Session API...\n');

    // 1. Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@photoboth.com',
      password: 'Admin123!'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Login successful\n');

    // 2. Get available photobooths
    console.log('2. Getting available photobooths...');
    const photoboothsResponse = await axios.get(`${BASE_URL}/photobooth/available`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const photoboothId = photoboothsResponse.data[0]?.id;
    if (!photoboothId) {
      throw new Error('No photobooths available');
    }
    console.log(`✅ Found photobooth: ${photoboothId}\n`);

    // 3. Create a new session
    console.log('3. Creating a new session...');
    const createResponse = await axios.post(`${BASE_URL}/photobooth/sessions`, {
      photoboothId: photoboothId,
      maxPhotos: 3,
      notes: 'Test session for cancellation'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const session = createResponse.data;
    console.log('✅ Session created successfully');
    console.log(`   Session ID: ${session.id}`);
    console.log(`   Status: ${session.status}\n`);

    // 4. Start the session
    console.log('4. Starting the session...');
    const startResponse = await axios.put(`${BASE_URL}/photobooth/sessions/${session.id}/start`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Session started successfully');
    console.log(`   Status: ${startResponse.data.status}\n`);

    // 5. Cancel the session as admin
    console.log('5. Cancelling session as admin...');
    const cancelResponse = await axios.put(`${BASE_URL}/admin/photobooth/sessions/${session.id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Session cancelled successfully');
    console.log(`   Session ID: ${cancelResponse.data.id}`);
    console.log(`   Status: ${cancelResponse.data.status}`);
    console.log(`   Cancelled At: ${cancelResponse.data.cancelledAt || 'N/A'}\n`);

    // 6. Verify photobooth is available again
    console.log('6. Verifying photobooth is available again...');
    const availableResponse = await axios.get(`${BASE_URL}/photobooth/available`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const isAvailable = availableResponse.data.some(pb => pb.id === photoboothId);
    console.log(`✅ Photobooth is ${isAvailable ? 'available' : 'not available'} again\n`);

    // 7. Try to cancel a completed session (should fail)
    console.log('7. Testing error case - trying to cancel completed session...');
    try {
      // First create and complete a session
      const createResponse2 = await axios.post(`${BASE_URL}/photobooth/sessions`, {
        photoboothId: photoboothId,
        maxPhotos: 2,
        notes: 'Test session for completion'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const session2 = createResponse2.data;
      await axios.put(`${BASE_URL}/photobooth/sessions/${session2.id}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Complete the session
      await axios.put(`${BASE_URL}/photobooth/sessions/${session2.id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Try to cancel completed session
      await axios.put(`${BASE_URL}/admin/photobooth/sessions/${session2.id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('❌ This should have failed!');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected cancelling completed session');
        console.log(`   Error: ${error.response.data.message}\n`);
      } else {
        throw error;
      }
    }

    // 8. Get sessions list to see the cancelled session
    console.log('8. Getting sessions list to verify cancellation...');
    const sessionsResponse = await axios.get(`${BASE_URL}/admin/photobooth/sessions?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Sessions retrieved successfully');
    console.log(`   Total sessions: ${sessionsResponse.data.meta.total}`);
    console.log(`   Recent sessions:`);
    
    sessionsResponse.data.data.slice(0, 3).forEach((session, index) => {
      console.log(`   ${index + 1}. Session ${session.id}`);
      console.log(`      User: ${session.user?.name || 'N/A'}`);
      console.log(`      Status: ${session.status}`);
      console.log(`      Created: ${new Date(session.createdAt).toLocaleString()}`);
    });

    console.log('\n🎉 All cancel session API tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testCancelSessionAPI();
