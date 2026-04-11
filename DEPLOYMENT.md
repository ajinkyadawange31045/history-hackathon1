# Deployment Guide

## Netlify Deployment

This project is configured for seamless deployment to Netlify with the following setup:

### Prerequisites
- Netlify account
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ (for local testing)

### Configuration Files Added

1. **`netlify.toml`** - Main Netlify configuration
   - Build command: `npm run build`
   - Publish directory: `dist`
   - SPA routing redirects
   - Node.js version specification

2. **`public/_redirects`** - Fallback routing for SPA
   - Ensures all routes serve `index.html`

### Deployment Methods

#### Method 1: Git-based Deployment (Recommended)
1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Netlify will automatically detect the configuration and deploy

#### Method 2: Drag and Drop
1. Run `npm run build` locally
2. Drag the `dist` folder to Netlify's deploy page
3. Your site will be live instantly

#### Method 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Build Process
The build process:
1. Runs `npm run build` (Vite production build)
2. Outputs to `dist/` directory
3. Optimizes assets and bundles the React app
4. Handles SPA routing automatically

### Environment Variables
Set these in Netlify dashboard if needed:
- `NODE_ENV`: Automatically set to `production` for production builds

### Custom Domain
After deployment:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Update DNS records as instructed by Netlify

### Troubleshooting

#### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Netlify dashboard

#### Routing Issues
- Ensure `public/_redirects` file exists
- Verify SPA routes work correctly
- Check that `netlify.toml` redirects are configured

#### Performance
- Enable Gzip compression (automatic on Netlify)
- Check asset optimization in Vite config
- Monitor Core Web Vitals in Netlify analytics

### Continuous Deployment
Netlify automatically:
- Deploys on every push to main branch
- Creates deploy previews for pull requests
- Rollbacks on failed deployments
- Provides build logs and error tracking
