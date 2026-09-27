# MERN Chat WebApp

A modern, real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js). Features include real-time messaging, secure authentication, media sharing (images and video), and a highly customizable interface with multiple themes and wallpapers.

## 🌟 Features

- **Real-time Messaging**: Instant message delivery and online status indicators powered by [Socket.io](https://socket.io/).
- **Secure Authentication**: Robust user authentication and session management handled by [Clerk](https://clerk.com/).
- **Media Sharing**: Upload and share images and videos in chats, seamlessly integrated with [ImageKit](https://imagekit.io/).
- **Rich UI & Theming**: Beautiful user interface built with [Tailwind CSS v4](https://tailwindcss.com/) and [HeroUI](https://heroui.com/). Includes dynamic theme toggling and customizable chat wallpapers.
- **State Management**: Predictable and efficient frontend state management using [Zustand](https://zustand-demo.pmnd.rs/).
- **React 19 & Compiler**: Built using the latest React features and optimized with the React Compiler.
- **Monorepo Architecture**: Clean separation of frontend and backend within a single repository, capable of being deployed as a monolith.
- **Docker Ready**: Includes a multi-stage Dockerfile for easy containerization and deployment.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + HeroUI
- **State Management**: Zustand
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Authentication**: `@clerk/react`

### Backend
- **Framework**: Express.js (Node.js v22)
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **File Uploads**: Multer
- **Media Storage**: ImageKit (`@imagekit/nodejs`)
- **Webhooks**: Clerk (For syncing Users to MongoDB)
- **Scheduled Tasks**: Cron (Self-ping to keep app awake)

## 📂 Project Structure

```text
├── backend/          # Express API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/      # DB connection, ImageKit, Socket.io, Cron config
│   │   ├── middleware/
│   │   ├── models/   # Mongoose schemas (User, Message)
│   │   ├── routes/
│   │   └── webhooks/ # Clerk user synchronization via webhooks
│   └── package.json
├── frontend/         # Vite React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/      # Route pages (AuthPage, ChatPage)
│   │   ├── store/      # Zustand stores (useAuthStore, useChatStore)
│   │   └── styles/
│   └── package.json
└── Dockerfile        # Production multi-stage build configuration
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v22 or higher recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- [Clerk](https://clerk.com/) account for Authentication
- [ImageKit](https://imagekit.io/) account for Media Uploads

### Environment Variables

Create a `.env` file in the **`backend/`** directory and add the following keys:

```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# Clerk Webhooks (For syncing users on user.created/updated/deleted events)
CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_signing_secret

# ImageKit Configuration (Required for sending images/videos in chat)
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

Create a `.env` file in the **`frontend/`** directory and add your Clerk Publishable Key:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Installation

1. Clone the repository and install dependencies for both the backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. Start the development servers:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The frontend application will be accessible at `http://localhost:5173`, and it will communicate with the backend API at `http://localhost:3000` automatically based on Vite's config or axios setup.

## 🐳 Docker Deployment

The project is configured to be deployed as a single monolithic application where the Express backend serves the static Vite frontend build. 

You can build and run the provided `Dockerfile`:

```bash
# Build the Docker image
# Requires passing the Clerk key at build-time for the frontend
docker build -t mern-chat-app --build-arg VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key .

# Run the container
# Pass the required backend environment variables
docker run -p 3001:3001 --env-file backend/.env mern-chat-app
```

In production mode, the application will serve the API at `/api` and the static React files from the root `/`, exposed on port `3001`.

## 📜 License

This project is licensed under the ISC License.
