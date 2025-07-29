# 🚀 Heroku Deployment Guide

This guide will help you deploy your todo-app backend to Heroku.

## 📋 Prerequisites

1. **Heroku Account:** Sign up at https://signup.heroku.com/
2. **Git:** Already installed on your system
3. **Node.js:** Already installed

## 🔧 Step 1: Install Heroku CLI

### Option A: Download from Heroku Website
1. Go to: https://devcenter.heroku.com/articles/heroku-cli
2. Download and install for macOS

### Option B: Using npm (if you have npm)
```bash
npm install -g heroku
```

## 🚀 Step 2: Deploy Backend to Heroku

### 2.1 Login to Heroku
```bash
heroku login
```

### 2.2 Create Heroku App
```bash
cd backend
heroku create your-todo-app-backend
```

### 2.3 Set Environment Variables
```bash
heroku config:set MONGO_URI="mongodb+srv://Nithin:nysv%402444@cluster0.ay94z6o.mongodb.net/todo-app?retryWrites=true&w=majority&appName=Cluster0"
heroku config:set JWT_SECRET="your_super_secret_jwt_key_here"
heroku config:set NODE_ENV="production"
```

### 2.4 Deploy to Heroku
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 2.5 Open Your App
```bash
heroku open
```

## 📱 Step 3: Deploy Frontend to Vercel

1. **Go to Vercel:** https://vercel.com/dashboard
2. **Import your GitHub repository:** `Nithin0525/myToDo-Application`
3. **Configure settings:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. **Add Environment Variable:**
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://your-todo-app-backend.herokuapp.com`
5. **Deploy**

## 🔗 Step 4: Connect Frontend to Backend

After deploying both:

1. **Get your Heroku backend URL:** `https://your-todo-app-backend.herokuapp.com`
2. **Update Vercel environment variable:**
   - Go to Vercel dashboard
   - Find your project
   - Go to Settings → Environment Variables
   - Update `REACT_APP_API_URL` with your Heroku URL
3. **Redeploy frontend**

## 🧪 Step 5: Test Your Deployment

### Test Backend API:
```bash
curl https://your-todo-app-backend.herokuapp.com/api/health
```

### Test Frontend:
- Visit your Vercel URL
- Register a new account
- Create some todos
- Test all features

## 🔒 Security Checklist

- [ ] Heroku app is running
- [ ] Environment variables are set
- [ ] MongoDB connection is working
- [ ] Frontend can communicate with backend
- [ ] CORS is properly configured

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures:**
   ```bash
   heroku logs --tail
   ```

2. **Environment Variables:**
   ```bash
   heroku config
   ```

3. **Database Connection:**
   - Check MongoDB Atlas network access
   - Verify connection string

4. **CORS Issues:**
   - Update backend CORS settings to allow your Vercel domain

## 📊 Monitoring

- **Heroku Dashboard:** Monitor app performance and logs
- **Heroku CLI:** `heroku logs --tail` for real-time logs
- **MongoDB Atlas:** Monitor database usage

## 🔄 Continuous Deployment

Heroku will automatically redeploy when you push changes to your GitHub repository.

---

**Your todo-app will be live on Heroku! 🌍**

## 📞 Support

- **Heroku Documentation:** https://devcenter.heroku.com/
- **Heroku CLI Commands:** https://devcenter.heroku.com/articles/heroku-cli-commands
- **Vercel Documentation:** https://vercel.com/docs 