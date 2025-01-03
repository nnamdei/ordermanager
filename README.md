
# OrderManager

OrderManager is a service for managing chat rooms, sending messages, and handling chat-related operations through WebSocket.

---

## To Get Started

1. Create an `.env` file with the sample `.env.example` file.
2. Create a PostgreSQL database table.
3. Update the Database URL and other variables in the `.env` file.
4. Change directory to the project directory.
5. Run migration with:
   ```bash
   npx prisma migrate dev --name init
   ```
6. Run:
   ```bash
   npx prisma generate
   ```
7. Run this to create an Admin user:
   ```bash
   npx ts-node prisma/seed.ts
   ```
8. Install dependencies:
   ```bash
   yarn install
   ```
9. Start the application:
   ```bash
   yarn start:dev
   ```
---

## API Docs

- **API Docs URL**: `http://localhost:3000/docs`

---

## WebSocket Configuration

- **WebSocket URL**: `ws://localhost:3001`

---

## Send Message

**Event**: `sendMessage`

**Request**:
```json
{
  "event": "sendMessage",
  "data": {
    "content": "Hello, World!",
    "chatRoomId": "room-id",
    "userId": "user-id"
  }
}
```

---

## Close Chat

**Event**: `closeChatRoom`

**Request**:
```json
{
  "event": "closeChatRoom",
  "data": {
    "chatRoomId": "room-id",
    "userId": "admin-id",
    "closeChatRoomDto": {
      "summary": "Room is closed for review",
      "orderId": "order-id"
    }
  }
}
```

---

## Fetch All Messages

**Event**: `getMessages`

**Request**:
```json
{
  "event": "getMessages",
  "data": {
    "chatRoomId": "room-id",
    "userId": "user-id"
  }
}
```

---

## Notes

- Replace `room-id`, `user-id`, `admin-id`, and `order-id` with actual values.
- Ensure the database is running and the `.env` file is correctly configured before starting the application.
