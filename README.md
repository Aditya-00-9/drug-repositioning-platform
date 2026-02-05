# Drug Platform

A Next.js application for exploring drug information, disease portals, and target portals.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd drug-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

- `app/` - Next.js App Router pages and components
- `app/components/` - Reusable React components
- `app/data/` - Data processing and store logic
- `app/drug/` - Drug-related pages
- `app/disease-portal/` - Disease portal page
- `app/target-portal/` - Target portal page

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run dev:win` - (Windows) Clear dev lock and start dev server if you see "Unable to acquire lock"
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📤 Deploying to GitHub

### Initial Setup (First Time)

1. **Create a new repository on GitHub** (if you haven't already):
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (don't initialize with README if you already have one)

2. **Add the remote and push**:
```bash
# If you haven't set up the remote yet
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Or if using SSH
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# Check current remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

### Regular Updates

```bash
# Stage all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

## 🚀 Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (see above)

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically:
     - Install dependencies (`npm install`)
     - Build your project (`npm run build`)
     - Deploy to production

4. **Automatic Deployments**:
   - Every push to `main` branch will trigger a new deployment
   - Pull requests will get preview deployments automatically

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration

The project is configured to work with Vercel out of the box. No additional configuration is needed, but you can customize:

- **Node.js Version**: Vercel uses Node.js 18+ by default (configured in `package.json` if needed)
- **Build Command**: `npm run build` (default for Next.js)
- **Output Directory**: `.next` (default for Next.js)
- **Install Command**: `npm install` (default)

### Environment Variables

If you need to add environment variables:

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add your variables

2. **For local development**, create a `.env.local` file (see `.env.example` for a template):
```bash
# .env.local
YOUR_VARIABLE_NAME=your_value
```

**Deep Research Mode** (drug/disease/target pages) requires an OpenAI API key:
```bash
# .env.local
OPENAI_API_KEY=sk-your-key-here
```
Get a key at [OpenAI API keys](https://platform.openai.com/api-keys). Restart the dev server after adding it.

**Note**: `.env.local` is already in `.gitignore` and won't be committed.

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All dependencies are in `package.json`
- [ ] No linter errors (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] All changes are committed to Git
- [ ] Code is pushed to GitHub

## 🔧 Troubleshooting

### Build Fails on Vercel

1. Check Vercel build logs for specific errors
2. Ensure Node.js version is 18+ in Vercel project settings
3. Verify all imports are correct
4. Check that all files are committed to Git
5. Ensure `package.json` has all required dependencies

### App won't start locally (Windows / PowerShell)

- **"The token '&&' is not a valid statement separator"**  
  In PowerShell, use `;` instead of `&&` to chain commands, e.g.  
  `cd c:\path\to\drug-platform; npm run dev`  
  Or open the terminal in the project folder and run `npm run dev` only.

- **"Unable to acquire lock" or "port 3000 is in use"**  
  Another Next.js dev server may be running. Either close that terminal/process, or run:  
  `npm run dev:win`  
  This clears the dev lock (if present) and starts the server. If port 3000 is still in use, Next.js will use the next free port (e.g. 3001); check the terminal for the URL.

### Common Issues

- **Module not found**: Make sure all dependencies are in `package.json` and run `npm install`
- **TypeScript errors**: Run `npm run build` locally to catch errors before deploying
- **Environment variables**: Add them in Vercel dashboard under Project Settings → Environment Variables

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [GitHub Documentation](https://docs.github.com)

## 📝 License

This project is private.
