# Quick Deployment Guide

## 🚀 Quick Start - Deploy to GitHub & Vercel

### Step 1: Push to GitHub

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Ready for deployment"

# Push to GitHub
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Select your repository
4. Click "Deploy" (settings are auto-detected)
5. Done! Your site will be live in ~2 minutes

### Future Updates

Just push to GitHub - Vercel will automatically deploy:

```bash
git add .
git commit -m "Update description"
git push origin main
```

That's it! Vercel handles the rest automatically.

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: Check your remote with `git remote -v`
- **Project Settings**: Vercel → Your Project → Settings

## ⚙️ First Time Setup

### If you haven't connected GitHub yet:

```bash
# Check if remote exists
git remote -v

# If not, add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push for the first time
git push -u origin main
```

### If you haven't set up Vercel:

1. Sign up at [vercel.com](https://vercel.com) with GitHub
2. Import your repository
3. Deploy!
