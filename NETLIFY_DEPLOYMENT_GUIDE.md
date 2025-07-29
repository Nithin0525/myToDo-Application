# 🚀 Netlify Deployment Guide

This guide will help you deploy your todo-app frontend to Netlify while keeping your backend on Render.

## 📋 Prerequisites

1. **Netlify Account:** Sign up at https://app.netlify.com/signup
2. **GitHub Repository:** Already set up at `Nithin0525/myToDo-Application`
3. **Backend:** Already deployed on Render at `https://mytodo-application.onrender.com`

## 🚀 Step 1: Deploy Frontend to Netlify

### 1.1 Go to Netlify Dashboard
- Visit: https://app.netlify.com/
- Sign in with your GitHub account

### 1.2 Create New Site
1. **Click "Add new site"**
2. **Select "Import an existing project"**
3. **Connect to GitHub**
4. **Select your repository:** `Nithin0525/myToDo-Application`

### 1.3 Configure Build Settings
Set these build settings:
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `build`

### 1.4 Set Environment Variables
Add this environment variable:
```
REACT_APP_API_URL = https://mytodo-application.onrender.com
```

### 1.5 Deploy
- Click "Deploy site"
- Wait for build to complete
- Note your frontend URL: `https://your-site-name.netlify.app`

## 🔗 Step 2: Connect Frontend to Backend

### 2.1 Verify Environment Variable
1. **Go to your site settings in Netlify**
2. **Go to Environment → Environment variables**
3. **Verify `REACT_APP_API_URL` is set to:** `https://mytodo-application.onrender.com`

### 2.2 Test the Connection
1. **Visit your Netlify URL**
2. **Register a new account**
3. **Test creating todos**
4. **Verify everything works**

## 🧪 Step 3: Test Your Deployment

### 3.1 Test Backend API
```bash
curl https://mytodo-application.onrender.com/api/health
```

### 3.2 Test Frontend
- Visit your Netlify URL
- Register and login
- Create, edit, and delete todos
- Test all features

## 🔒 Security Checklist

- [ ] Frontend is deployed and accessible
- [ ] Frontend can communicate with backend
- [ ] Environment variable is set correctly
- [ ] CORS is properly configured
- [ ] JWT authentication is working

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check build logs in Netlify dashboard
   - Ensure all dependencies are in package.json
   - Verify build commands are correct

2. **Environment Variables:**
   - Double-check `REACT_APP_API_URL` is set correctly
   - Ensure variable name matches exactly

3. **API Connection:**
   - Verify backend URL is correct in environment variable
   - Check CORS settings in backend

4. **CORS Issues:**
   - Update backend CORS settings to allow your Netlify domain

## 📊 Monitoring

- **Netlify Dashboard:** Monitor frontend performance and errors
- **Function Logs:** Check build logs in Netlify dashboard
- **Performance:** Monitor response times and errors

## 🔄 Continuous Deployment

Netlify will automatically redeploy when you push changes to your GitHub repository.

## 🎯 URLs After Deployment

- **Backend API:** `https://mytodo-application.onrender.com`
- **Frontend App:** `https://your-site-name.netlify.app`
- **Database:** MongoDB Atlas (already configured)

## 💰 Pricing

- **Free Tier:** Available for static sites
- **Paid Plans:** Available for advanced features
- **Limitations:** Free tier has some restrictions

## 📞 Support

- **Netlify Documentation:** https://docs.netlify.com/
- **Netlify Dashboard:** https://app.netlify.com/
- **Community:** Netlify has an active community

---

**Your todo-app will be live on Netlify + Render! 🌍** 