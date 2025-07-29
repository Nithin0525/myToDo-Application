# 🚀 Vercel Deployment Guide

This guide will help you deploy your entire todo-app to Vercel (both frontend and backend).

## 📋 Prerequisites

1. **Vercel Account:** Sign up at https://vercel.com/signup
2. **GitHub Repository:** Already set up at `Nithin0525/myToDo-Application`
3. **MongoDB Atlas:** Already configured

## 🚀 Step 1: Deploy Backend to Vercel

### 1.1 Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Sign in with your GitHub account

### 1.2 Create Backend Project
1. **Click "New Project"**
2. **Import your repository:** `Nithin0525/myToDo-Application`
3. **Configure settings:**
   - **Framework Preset:** Node.js
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Output Directory:** `backend`
   - **Install Command:** `npm install`

### 1.3 Set Environment Variables
Add these environment variables in the Vercel dashboard:
```
MONGO_URI = mongodb+srv://Nithin:nysv%402444@cluster0.ay94z6o.mongodb.net/todo-app?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = your_super_secret_jwt_key_here
NODE_ENV = production
```

### 1.4 Deploy Backend
- Click "Deploy"
- Wait for deployment to complete
- Note your backend URL: `https://your-backend-name.vercel.app`

## 📱 Step 2: Deploy Frontend to Vercel

### 2.1 Create Frontend Project
1. **Go back to Vercel Dashboard**
2. **Click "New Project"**
3. **Import the same repository:** `Nithin0525/myToDo-Application`
4. **Configure settings:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

### 2.2 Set Environment Variables
Add this environment variable:
```
REACT_APP_API_URL = https://your-backend-name.vercel.app
```
(Use the backend URL from Step 1.4)

### 2.3 Deploy Frontend
- Click "Deploy"
- Wait for deployment to complete
- Note your frontend URL: `https://your-frontend-name.vercel.app`

## 🔗 Step 3: Connect Frontend to Backend

### 3.1 Update Frontend Environment Variable
1. **Go to your frontend project in Vercel**
2. **Go to Settings → Environment Variables**
3. **Update `REACT_APP_API_URL`** with your backend URL
4. **Redeploy the frontend**

### 3.2 Test the Connection
1. **Visit your frontend URL**
2. **Register a new account**
3. **Test creating todos**
4. **Verify everything works**

## 🧪 Step 4: Test Your Deployment

### 4.1 Test Backend API
```bash
curl https://your-backend-name.vercel.app/api/health
```

### 4.2 Test Frontend
- Visit your frontend URL
- Register and login
- Create, edit, and delete todos
- Test all features

## 🔒 Security Checklist

- [ ] Backend is deployed and accessible
- [ ] Frontend can communicate with backend
- [ ] Environment variables are set correctly
- [ ] MongoDB connection is working
- [ ] CORS is properly configured
- [ ] JWT authentication is working

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify build commands are correct

2. **Environment Variables:**
   - Double-check all environment variables are set
   - Ensure variable names match exactly

3. **API Connection:**
   - Verify backend URL is correct in frontend environment
   - Check CORS settings in backend

4. **Database Connection:**
   - Verify MongoDB Atlas network access
   - Check connection string format

## 📊 Monitoring

- **Vercel Dashboard:** Monitor both frontend and backend
- **Function Logs:** Check serverless function logs
- **Performance:** Monitor response times and errors

## 🔄 Continuous Deployment

Vercel will automatically redeploy when you push changes to your GitHub repository.

## 🎯 URLs After Deployment

- **Backend API:** `https://your-backend-name.vercel.app`
- **Frontend App:** `https://your-frontend-name.vercel.app`
- **Database:** MongoDB Atlas (already configured)

## 📞 Support

- **Vercel Documentation:** https://vercel.com/docs
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Function Logs:** Available in Vercel dashboard

---

**Your todo-app will be live on Vercel! 🌍** 