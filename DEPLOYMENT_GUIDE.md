# 🚀 Todo App Deployment Guide

This guide will help you deploy your todo-app to production.

## 📱 Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Sign in with your GitHub account

2. **Import Your Repository:**
   - Click "New Project"
   - Import your GitHub repository: `Nithin0525/myToDo-Application`
   - Select the repository

3. **Configure Build Settings:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

4. **Environment Variables:**
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.railway.app`
   - (We'll get this URL after deploying the backend)

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at: `https://your-app-name.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set project name
# - Set build settings
```

## 🔧 Backend Deployment (Railway)

### Step 1: Prepare Backend for Railway

1. **Create Railway Account:**
   - Visit: https://railway.app
   - Sign in with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository: `Nithin0525/myToDo-Application`

3. **Configure Backend Directory:**
   - Set **Root Directory** to: `backend`
   - Railway will auto-detect Node.js

4. **Environment Variables:**
   Add these environment variables in Railway dashboard:
   ```
   PORT=5001
   MONGO_URI=mongodb+srv://Nithin:nysv%402444@cluster0.ay94z6o.mongodb.net/todo-app?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=production
   ```

5. **Deploy:**
   - Railway will automatically deploy
   - Get your backend URL: `https://your-backend-name.railway.app`

## 🗄️ Database Setup (MongoDB Atlas)

Your MongoDB Atlas is already configured! The connection string is:
```
mongodb+srv://Nithin:nysv%402444@cluster0.ay94z6o.mongodb.net/todo-app?retryWrites=true&w=majority&appName=Cluster0
```

## 🔗 Connect Frontend to Backend

After deploying both:

1. **Update Frontend Environment Variable:**
   - Go to Vercel dashboard
   - Find your project
   - Go to Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your Railway backend URL

2. **Redeploy Frontend:**
   - In Vercel dashboard, go to Deployments
   - Click "Redeploy" on the latest deployment

## 🧪 Test Your Deployment

1. **Test Backend API:**
   ```bash
   curl https://your-backend-url.railway.app/api/health
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Register a new account
   - Create some todos
   - Test all features

## 🔒 Security Checklist

- [ ] Backend has proper CORS configuration
- [ ] Environment variables are set
- [ ] JWT secret is secure
- [ ] MongoDB connection is working
- [ ] Frontend can communicate with backend

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Update backend CORS settings to allow your Vercel domain

2. **Environment Variables:**
   - Double-check all environment variables are set correctly

3. **Build Failures:**
   - Check build logs in Vercel/Railway dashboard
   - Ensure all dependencies are in package.json

4. **API Connection:**
   - Verify backend URL is correct in frontend environment variables

## 📊 Monitoring

- **Vercel:** Monitor frontend performance and errors
- **Railway:** Monitor backend logs and performance
- **MongoDB Atlas:** Monitor database usage and performance

## 🔄 Continuous Deployment

Both Vercel and Railway will automatically redeploy when you push changes to your GitHub repository.

---

**Your todo-app will be live and accessible from anywhere in the world! 🌍** 