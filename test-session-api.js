const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testSessionAPI() {
  try {
    console.log('🧪 Testing Session API with Authentication...\n');

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

    // 3. Create session (should work with authentication)
    console.log('3. Creating session with authentication...');
    const createResponse = await axios.post(`${BASE_URL}/photobooth/sessions`, {
      photoboothId: photoboothId,
      maxPhotos: 3,
      notes: 'Test session with authenticated user'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const session = createResponse.data;
    console.log('✅ Session created successfully');
    console.log(`   Session ID: ${session.id}`);
    console.log(`   User ID: ${session.userId}`);
    console.log(`   User Name: ${session.user?.name || 'N/A'}`);
    console.log(`   Status: ${session.status}\n`);

    // 4. Get sessions list
    console.log('4. Getting sessions list...');
    const sessionsResponse = await axios.get(`${BASE_URL}/admin/photobooth/sessions?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Sessions retrieved successfully');
    console.log(`   Total sessions: ${sessionsResponse.data.meta.total}`);
    console.log(`   Sessions with user info:`);
    
    sessionsResponse.data.data.forEach((session, index) => {
      console.log(`   ${index + 1}. Session ${session.id}`);
      console.log(`      User: ${session.user?.name || 'N/A'} (${session.user?.email || 'N/A'})`);
      console.log(`      Photobooth: ${session.photobooth?.name || 'N/A'}`);
      console.log(`      Status: ${session.status}`);
      console.log(`      Photos: ${session.photoCount}/${session.maxPhotos}`);
    });

    console.log('\n🎉 All tests passed! Session API is working correctly with authentication.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testSessionAPI();
