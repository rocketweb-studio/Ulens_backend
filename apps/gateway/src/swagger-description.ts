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
  - **Payload**: \`{ roomId: number; content: string; media?: MessageImgOutputDto[] | null }\`
    - \`roomId\`: number - The room ID where the message will be sent
    - \`content\`: string - Message text content
    - \`media\`: MessageImgOutputDto[] | null (optional) - Array of message images. Images must be uploaded first using the REST API endpoint \`POST /api/v1/messenger/rooms/:roomId/images\`
  - **Purpose**: Sends a message to a specific chat room with optional images
  - **Example**:
    \`\`\`typescript
    // Send text message only
    socket.emit('SEND_MESSAGE', { roomId: 123, content: 'Hello, world!' });

    // Send message with images
    socket.emit('SEND_MESSAGE', {
      roomId: 123,
      content: 'Check out these images!',
      media: [
        { id: 'img-id-1', messageId: null, url: 'bucket/image1.webp', width: 192, height: 192, fileSize: 100000, size: 'small' },
        { id: 'img-id-2', messageId: null, url: 'bucket/image2.webp', width: 192, height: 192, fileSize: 100000, size: 'small' }
      ]
    });
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
    - \`media\`: MessageImgOutputDto[] | null - Array of message images (each containing: id, messageId, url, width, height, fileSize, size)
    - \`createdAt\`: Date - Message creation timestamp
    - \`author\`: Object - Message author information (id, userName, firstName, lastName, avatar)
  - **Purpose**: Real-time message delivery to clients subscribed to the specific room
  - **Room**: Emitted to \`chat:{roomId}\` room

- **\`NEW_GLOBAL_MESSAGE\`**: New message received in any room (for subscribed users)
  - **Data**: \`MessageOutputDto\` object with additional \`roomId\` field:
    - \`id\`: number - Message ID
    - \`content\`: string - Message content
    - \`media\`: MessageImgOutputDto[] | null - Array of message images (each containing: id, messageId, url, width, height, fileSize, size)
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

## REST API Endpoints

### Messenger Endpoints

#### Upload Message Images
- **Endpoint**: \`POST /api/v1/messenger/rooms/:roomId/images\`
- **Authentication**: Required (JWT token in Authorization header)
- **Content-Type**: \`multipart/form-data\`
- **Path Parameters**:
  - \`roomId\`: number - The room ID where images will be associated
- **Request Body**:
  - \`images\`: File[] - Array of image files (JPEG, PNG) with max size 20MB per file
- **Response**: \`UploadImageOutputDto\` containing:
  - \`files\`: MessageImgOutputDto[] - Array of uploaded image objects, each containing:
    - \`id\`: string - Image ID (use this in the \`SEND_MESSAGE\` WebSocket event)
    - \`messageId\`: number | null - Initially null, will be set when message is sent
    - \`url\`: string - Image URL
    - \`width\`: number - Image width in pixels
    - \`height\`: number - Image height in pixels
    - \`fileSize\`: number - File size in bytes
    - \`size\`: string - Image size variant (\`small\`, \`medium\`, \`large\`)
- **Example**:
  \`\`\`typescript
  // Upload images first
  const formData = new FormData();
  formData.append('images', file1);
  formData.append('images', file2);

  const response = await fetch('https://ulens.org/api/v1/messenger/rooms/123/images', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer your_access_token_here'
    },
    body: formData
  });

  const { files } = await response.json();

  // Then send message with uploaded images via WebSocket
  socket.emit('SEND_MESSAGE', {
    roomId: 123,
    content: 'Check out these images!',
    media: files
  });
  \`\`\`
- **Note**: Images must be uploaded via this REST endpoint before they can be included in a \`SEND_MESSAGE\` WebSocket event. The returned image IDs should be used in the \`media\` field of the \`SEND_MESSAGE\` payload.
`;
