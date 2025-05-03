# 🚀 Getting Started with AI Trip Planner (Full Stack Project)

This guide will help you set up both the **backend** and **frontend** of the AI Trip Planner project on your local machine.

---

## 🧩 Prerequisites

Make sure the following are installed on your system:

- [Node.js](https://nodejs.org/) (v16+ recommended)  
- [MongoDB](https://www.mongodb.com/) (Local or Cloud)  
- [Git](https://git-scm.com/)  
- npm or yarn  

---

## 📁 Project Structure

```
Trip-planner-AI-web/
│
├── backend/
└── frontend/
```

---

## 🔧 Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `/backend` directory and add the following:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   GOOGLE_API_KEY=your_google_api_key
   ```

4. Run the backend server:
   ```bash
   npm start
   ```

📍 Server will be running at: `http://localhost:5000`

---

## 🌐 Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `/frontend` directory and add the following:

   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
   ```

4. Run the frontend app:
   ```bash
   npm run dev
   ```

📍 App will be running at: `http://localhost:5173`

---

## ✅ Done!

You now have the **AI Trip Planner** running locally on your machine!  
Make sure to replace placeholder API keys with your own and keep sensitive data secure.
