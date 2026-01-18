# Vercel Deployment Guide for Hocco Admin Panel

## Prerequisites
1. ✅ Backend already deployed to Vercel
2. ✅ Git repository initialized
3. ✅ Vercel account created

## Step-by-Step Deployment Instructions

### 1. Set Up Environment Variables
Before deploying, you need to set up your environment variables:

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your actual values in `.env`:**
   ```
   VITE_API_BASE_URL=https://your-backend-vercel-app.vercel.app
   VITE_MAPBOX_ACCESS_TOKEN=your_actual_mapbox_token
   VITE_ADMIN_API_KEY=your_actual_admin_api_key
   ```

### 2. Test the Build Locally
Make sure everything builds correctly:
```bash
npm run build
```

If the build succeeds, you'll see a `dist` folder created.

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project? **N** (first time)
   - Project name: **hocco-admin-panel** (or your preferred name)
   - Directory: **.** (current directory)
   - Override settings? **N**

#### Option B: Using Vercel Web Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Vercel will auto-detect it's a Vite project
5. Click "Deploy"

### 4. Configure Environment Variables in Vercel
After deployment, you need to add environment variables in Vercel:

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:
   - `VITE_API_BASE_URL` = `https://your-backend-vercel-app.vercel.app`
   - `VITE_MAPBOX_ACCESS_TOKEN` = `your_mapbox_token`
   - `VITE_ADMIN_API_KEY` = `your_admin_api_key`

4. **Important:** After adding environment variables, redeploy by going to **Deployments** tab and clicking "Redeploy"

### 5. Update Your Backend CORS Settings
Make sure your backend allows requests from your new admin panel domain:

```javascript
// In your backend CORS configuration
const allowedOrigins = [
  'http://localhost:3001',
  'https://your-admin-panel-app.vercel.app' // Add this line
];
```

### 6. Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

## Important Notes

### Environment Variables
- ❗ **Never commit `.env` files to Git**
- ❗ All environment variables for frontend must start with `VITE_`
- ❗ The `ADMIN_API_KEY` in frontend must match your backend's expected admin key

### Security
- Your admin panel will be publicly accessible
- Make sure your backend properly validates the admin API key
- Consider adding authentication/authorization

### Troubleshooting

#### Build Errors
- Check that all environment variables are set
- Ensure TypeScript types are correct
- Run `npm run lint` to check for issues

#### API Connection Issues
- Verify `VITE_API_BASE_URL` points to your correct backend URL
- Check browser console for CORS errors
- Verify backend is responding to health checks

#### 404 Errors on Route Navigation
- The `vercel.json` file handles this with SPA rewrites
- All routes will serve `index.html` for client-side routing

## Files Created/Modified
- ✅ `vercel.json` - Vercel configuration
- ✅ `.env.example` - Environment variables template  
- ✅ `.gitignore` - Updated to exclude environment files
- ✅ `vite.config.ts` - Added build optimization

## Next Steps After Deployment
1. Test all functionality on the deployed URL
2. Verify API calls work correctly
3. Check that maps and real-time features function
4. Set up monitoring/analytics if needed

---

**🚀 Ready to Deploy!** Follow the steps above and your admin panel will be live on Vercel!