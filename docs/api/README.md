# Photobooth API Documentation

## Overview

Complete API documentation for the Photobooth Management System, including session management, photo handling, user authentication, and admin controls.

## 📚 Documentation Structure

### Core API Documentation
- **[Photobooth Session API](./photobooth-session-api.md)** - Complete API reference with all endpoints, request/response schemas, and error handling
- **[Session API Examples](./session-api-examples.md)** - Real-world examples, test cases, and integration scenarios

### Additional Resources
- **[Admin Dashboard Requirements](../admin-dashboard-requirements.md)** - Frontend requirements and UI specifications
- **[API Examples](../api-examples.md)** - General API usage examples and patterns

## 🚀 Quick Start

### 1. Authentication
```bash
# Login to get JWT token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### 2. Create Session
```bash
# Create a new photobooth session
curl -X POST http://localhost:3000/api/v1/photobooth/sessions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"photoboothId": "photobooth-id", "maxPhotos": 5}'
```

### 3. Complete Flow
```bash
# Start session
curl -X PUT http://localhost:3000/api/v1/photobooth/sessions/{sessionId}/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'

# Take photos
curl -X POST http://localhost:3000/api/v1/photobooth/sessions/{sessionId}/photos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/photo.jpg", "caption": "My photo"}'

# Complete session
curl -X PUT http://localhost:3000/api/v1/photobooth/sessions/{sessionId}/complete \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 📋 API Endpoints Summary

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/logout` | User logout |

### Photobooth Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/photobooth/status` | System status |
| GET | `/api/v1/photobooth/available` | Available photobooths |

### Session Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/photobooth/sessions` | Create session |
| GET | `/api/v1/photobooth/sessions/{id}` | Get session details |
| PUT | `/api/v1/photobooth/sessions/{id}/start` | Start session |
| PUT | `/api/v1/photobooth/sessions/{id}/complete` | Complete session |
| PUT | `/api/v1/photobooth/sessions/{id}/cancel` | Cancel session |

### Photo Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/photobooth/sessions/{id}/photos` | Get session photos |
| POST | `/api/v1/photobooth/sessions/{id}/photos` | Take photo |
| GET | `/api/v1/photobooth/photos/{id}` | Get photo details |

### Admin Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/photobooth/photobooths` | List all photobooths |
| POST | `/api/v1/admin/photobooth/photobooths` | Create photobooth |
| GET | `/api/v1/admin/photobooth/sessions` | List all sessions |
| GET | `/api/v1/admin/photobooth/stats` | System statistics |
| POST | `/api/v1/admin/photobooth/cleanup/expired-sessions` | Cleanup expired sessions |

## 🔧 Key Features

### Session Lifecycle
```
PENDING → ACTIVE → COMPLETED
   ↓         ↓
EXPIRED   CANCELLED
```

### User Information Integration
- **Automatic User Context**: Sessions automatically include user information from JWT token
- **Role-based Access**: Different permissions for users vs admins
- **User Session Limits**: Prevent multiple active sessions per user

### Photobooth Status Management
- **Real-time Status**: Available, Busy, Maintenance
- **Concurrency Control**: Only one active session per photobooth
- **Automatic Status Updates**: Status changes based on session state

### Photo Management
- **Ordered Photos**: Automatic ordering (1, 2, 3, ...)
- **Photo Limits**: Enforce maximum photos per session
- **Caption Support**: Optional captions for each photo
- **Processing Status**: Track photo processing state

## 🛡️ Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: User and admin roles with different permissions
- **Token Expiration**: Automatic token expiration for security

### Data Validation
- **Input Validation**: Comprehensive request validation
- **Status Validation**: Ensure proper session state transitions
- **Business Logic**: Enforce business rules and constraints

### Error Handling
- **Comprehensive Error Responses**: Detailed error messages with status codes
- **Validation Errors**: Field-specific validation error messages
- **Business Logic Errors**: Clear error messages for business rule violations

## 📊 Monitoring & Analytics

### System Statistics
- **Photobooth Utilization**: Track usage across all photobooths
- **Session Analytics**: Average duration, completion rates
- **Photo Statistics**: Total photos, processing status
- **User Activity**: Session counts per user

### Admin Dashboard Support
- **Real-time Data**: Live system status and metrics
- **Historical Data**: Past sessions and performance data
- **Management Tools**: Cleanup, maintenance, and configuration

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Complete user flow testing
- **Load Tests**: Performance and scalability testing

### Test Examples
- **Complete User Journey**: Login → Create → Start → Photos → Complete
- **Error Scenarios**: Invalid inputs, unauthorized access, business rule violations
- **Admin Operations**: Statistics, cleanup, management functions

## 🔄 API Versioning

### Current Version: v1
- **Base URL**: `/api/v1/`
- **Backward Compatibility**: Maintained for stable features
- **Deprecation Policy**: 6-month notice for breaking changes

### Future Versions
- **v2**: Planned for advanced features (WebSocket support, real-time updates)
- **Migration Guide**: Will be provided for version upgrades

## 📈 Performance Considerations

### Rate Limiting
- **Authentication**: 5 requests/minute per IP
- **Session Creation**: 10 requests/minute per user
- **Photo Upload**: 30 requests/minute per session
- **Admin Operations**: 100 requests/minute per admin

### Optimization
- **Database Indexing**: Optimized queries for performance
- **Caching**: Redis caching for frequently accessed data
- **Pagination**: Efficient data pagination for large datasets

## 🚀 Deployment

### Environment Setup
- **Development**: `http://localhost:3000`
- **Staging**: `https://staging-api.photoboth.com`
- **Production**: `https://api.photoboth.com`

### Configuration
- **Environment Variables**: Database, Redis, JWT secrets
- **CORS Settings**: Configured for frontend integration
- **Logging**: Comprehensive logging for monitoring

## 📞 Support

### Documentation
- **API Reference**: Complete endpoint documentation
- **Examples**: Real-world usage examples
- **Error Codes**: Comprehensive error reference

### Contact
- **Email**: support@photoboth.com
- **GitHub**: https://github.com/photoboth/api
- **Documentation**: https://docs.photoboth.com

## 📝 Changelog

### Version 1.0.0 (2025-10-27)
- ✅ Complete session management API
- ✅ User authentication and authorization
- ✅ Photo management system
- ✅ Admin dashboard support
- ✅ Real-time status monitoring
- ✅ Comprehensive error handling
- ✅ Complete API documentation
- ✅ Test examples and scripts

---

## 🎯 Next Steps

1. **Review Documentation**: Read through the complete API reference
2. **Run Examples**: Test the provided examples with your setup
3. **Integrate Frontend**: Use the API endpoints in your application
4. **Monitor Performance**: Set up monitoring and analytics
5. **Provide Feedback**: Share feedback for improvements

**Happy coding! 🚀📸**
