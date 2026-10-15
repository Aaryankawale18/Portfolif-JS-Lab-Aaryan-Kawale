# Aaryan Kawale — Portfolio

Aurora glassmorphism personal portfolio website built with pure vanilla HTML, CSS, and JavaScript.

---

## 3-Step GitHub + Render Deployment Guide

### Step 1: Push Code to GitHub
1. Open terminal inside the `portfolio` directory:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio release"
   ```
2. Create a new repository named `portfolio` on GitHub (`https://github.com/new`).
3. Link and push your local repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/Aaryankawale18/portfolio.git
   git push -u origin main
   ```

### Step 2: Create Static Site on Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Static Site**.
3. Connect your GitHub account and choose the `portfolio` repository.

### Step 3: Configure Settings & Deploy
1. Fill in the build & deploy configuration:
   - **Name**: `aaryan-kawale-portfolio` (or your preferred site name)
   - **Branch**: `main`
   - **Root Directory**: leave blank (defaults to repository root)
   - **Build Command**: leave empty (no build step needed)
   - **Publish Directory**: `.` (or `./`)
2. Click **Create Static Site**.
3. Render will deploy your website in seconds at a live URL (e.g. `https://aaryan-kawale-portfolio.onrender.com`).
