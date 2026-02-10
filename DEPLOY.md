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

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** → **Project** and import your GitHub repo.
3. **Add environment variable** (required for AI features):
   - Before or after the first deploy: open your project → **Settings** → **Environment Variables**.
   - Add:
     - **Name:** `OPENAI_API_KEY`
     - **Value:** your OpenAI API key (same as in `.env.local` locally).
     - **Environment:** check Production, Preview, and Development if you use Vercel previews.
   - Save. Redeploy (Deployments → ⋮ on latest → Redeploy) so the new env is applied.
4. Click **Deploy** (or let the first deploy run; add the variable and redeploy after).
5. Your site will be live at `https://your-project.vercel.app`. AI-powered drug/disease profiles will work once `OPENAI_API_KEY` is set.

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
