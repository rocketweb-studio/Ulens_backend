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

### Chat WebSocket Events

#### Client to Server Events
- **\`SUBSCRIBE_CHAT\`**: Subscribe to a specific chat room
  - **Authentication**: Required (JWT token in auth object)
  - **Payload**: \`{ roomId: number }\`
  - **Purpose**: Joins the client to a specific chat room to receive messages
  - **Example**:
    \`\`\`typescript
    socket.emit('SUBSCRIBE_CHAT', { roomId: 123 });
    \`\`\`

- **\`SEND_MESSAGE\`**: Send a message to a room
  - **Authentication**: Required (JWT token in auth object)
  - **Payload**: \`{ roomId: number; content: string }\`
  - **Purpose**: Sends a message to a specific chat room
  - **Example**:
    \`\`\`typescript
    socket.emit('SEND_MESSAGE', { roomId: 123, content: 'Hello, world!' });
    \`\`\`

- **\`SUBSCRIBE_ALL_ROOM_MESSAGES\`**: Subscribe to all room messages for a user
  - **Authentication**: Required (JWT token in auth object)
  - **Payload**: \`{ userId: string }\`
  - **Purpose**: Joins the client to receive messages from all rooms where the user is a participant
  - **Example**:
    \`\`\`typescript
    socket.emit('SUBSCRIBE_ALL_ROOM_MESSAGES', { userId: 'user-id-here' });
    \`\`\`

#### Server to Client Events
- **\`NEW_MESSAGE\`**: New message received in a subscribed chat room
  - **Data**: \`MessageOutputDto\` object containing:
    - \`id\`: number - Message ID
    - \`content\`: string - Message content
    - \`mediaUrl\`: string | null - Optional media URL
    - \`createdAt\`: Date - Message creation timestamp
    - \`author\`: Object - Message author information (id, userName, firstName, lastName, avatar)
  - **Purpose**: Real-time message delivery to clients subscribed to the specific room
  - **Room**: Emitted to \`chat:{roomId}\` room

- **\`NEW_GLOBAL_MESSAGE\`**: New message received in any room (for subscribed users)
  - **Data**: \`MessageOutputDto\` object with additional \`roomId\` field:
    - \`id\`: number - Message ID
    - \`content\`: string - Message content
    - \`mediaUrl\`: string | null - Optional media URL
    - \`createdAt\`: Date - Message creation timestamp
    - \`author\`: Object - Message author information
    - \`roomId\`: number - The room ID where the message was sent
  - **Purpose**: Real-time message delivery to clients subscribed to all room messages
  - **Room**: Emitted to \`room:{userId}:all-room-messages\` room

### Error Handling
- **Missing Token**: Connection will be rejected with error message
- **Invalid Token**: Connection will be rejected and socket disconnected
- **Network Issues**: Socket.IO will automatically attempt to reconnect

### Room System
- **Notifications**: Each authenticated user can join their private notification room: \`user:{userId}:notifications\`
- **Chat Rooms**: Clients can subscribe to specific chat rooms: \`chat:{roomId}\`
- **All Room Messages**: Clients can subscribe to receive messages from all their rooms: \`room:{userId}:all-room-messages\`

This ensures messages and notifications are only sent to the intended recipients.
`;
