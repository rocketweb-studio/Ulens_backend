export const swaggerDescription = `
Welcome to the best API documentation ever!

## WebSocket Connection Guide

### Overview
This API provides real-time notifications through WebSocket connections using Socket.IO. The WebSocket server runs on the same port as the REST API with the namespace \`/ws\`.

### Connection Details
- **Protocol**: WebSocket (Socket.IO) 
- **Namespace**: \`/ws\`
- **Port**: Same as the REST API (typically 3000 for development)
- **URL**: \`http://localhost:4000/ws\` (development) or \`https://ulens.org/ws\` (production)

### Frontend Integration

#### 1. Install Dependencies
\`\`\`bash
npm install socket.io-client
# or
yarn add socket.io-client
\`\`\`

#### 2. Connection Requirements

When connecting, clients must include an **accessToken** as a query parameter to authenticate. The connection parameters should be structured as follows and passed as the second argument to the io method:
\`\`\`typescript
    const socket = io('https://ulens.org/ws', {
      auth: {
        token: 'your_access_token_here',
        },
    });
\`\`\`

#### 3. Notification WebSocket Events

#### Client to Server Events
- **\`SUBSCRIBE_NOTIFICATIONS\`**: Subscribe to notifications for the authenticated user
  - **Authentication**: Required (JWT token in auth object)
  - **Purpose**: Joins the user to their notification room

#### Server to Client Events
- **\`NEW_NOTIFICATION\`**: New notification received
  - **Data**: \`{ message: string }\`
  - **Purpose**: Real-time notification delivery

- **\`TEST_NOTIFICATION\`**: Test notification
  - **Data**: \`{ message: string }\`
  - **Purpose**: Test notification delivery

- **\`ERROR\`**: Error occurred
  - **Data**: Error message string
  - **Purpose**: Handle connection/auth errors

### Error Handling
- **Missing Token**: Connection will be rejected with error message
- **Invalid Token**: Connection will be rejected and socket disconnected
- **Network Issues**: Socket.IO will automatically attempt to reconnect

### Room System
Each authenticated user is automatically joined to a private room: \`user:{userId}:notifications\`
This ensures notifications are only sent to the intended recipient.
`;
