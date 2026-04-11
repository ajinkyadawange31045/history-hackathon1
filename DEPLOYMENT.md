# 🚀 DEPLOYMENT & PRODUCTION GUIDE

Complete guide for deploying the Intelligent Archival Search System to production

---

## PRE-DEPLOYMENT CHECKLIST

### Code & Functionality
- [ ] All components render without errors
- [ ] Search works across all fields
- [ ] Filters apply correctly (desktop + mobile)
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Keyboard shortcuts work (Cmd+K, Escape)
- [ ] No console errors in browser DevTools

### Performance
- [ ] Build size acceptable (target: < 500KB gzipped)
- [ ] Search debounce timing appropriate
- [ ] No memory leaks (check DevTools)
- [ ] Lighthouse score > 80

### Content & Copy
- [ ] Hero title & subtitle updated
- [ ] Footer text customized
- [ ] Contact/help information added
- [ ] All documentation updated

### Data
- [ ] `archive.json` properly formatted
- [ ] All documents have required fields
- [ ] No special characters breaking JSON
- [ ] Test with full dataset (if large)

### Security
- [ ] No sensitive data in comments
- [ ] `.env` variables defined (if needed)
- [ ] CORS headers configured
- [ ] CSP (Content Security Policy) set

### Accessibility
- [ ] Color contrast verified (WCAG AA minimum)
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Focus indicators visible

---

## BUILD FOR PRODUCTION

### Step 1: Create Optimized Build

```bash
npm run build
```

**Output:**
- `dist/` folder created
- HTML minified
- CSS bundled & minified
- JavaScript optimized
- Assets hashed for cache busting

### Step 2: Verify Build

```bash
npm run preview
```

Opens local preview of production build at `http://localhost:4173`

**Check:**
- ✅ Assets load correctly
- ✅ Search works
- ✅ Styling applies
- ✅ No 404 errors

### Step 3: Check Build Size

```bash
# Get bundle analysis
npm run build

# Look at dist/ size
ls -lh dist/

# Typical size: 150-300KB (gzipped: 50-100KB)
```

---

## DEPLOYMENT OPTIONS

### Option 1: Vercel (Recommended for React)

**Best for:** Beginners, automatic deployments, serverless functions

#### Setup

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel
```

**Configuration:** Create `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": {
      "default": "https://api.example.com"
    }
  }
}
```

**Automatic Deployments:**
```bash
# Push to GitHub/GitLab
git push origin main

# Vercel automatically deploys
# Preview URL: https://<project>-git-<branch>.vercel.app
```

**Result:** 
- ✅ Custom domain support
- ✅ Automatic SSL
- ✅ CDN globally distributed
- ✅ Environment variables

---

### Option 2: Netlify

**Best for:** Static hosting, git workflows, build previews

#### Setup

```bash
# 1. Connect GitHub repository
# https://app.netlify.com/signup

# 2. Configure build settings:
Build command: npm run build
Publish directory: dist

# 3. Deploy from Git
# Netlify auto-deploys on push to main
```

**Configuration:** Create `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev"
  port = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

**Custom Domain:**
```
Domain Settings → Add custom domain
Point DNS CNAME to Netlify
SSL auto-generated
```

---

### Option 3: GitHub Pages

**Best for:** Open-source projects, free hosting, portfolio

#### Setup

```bash
# 1. Update vite.config.js
export default {
  base: '/repository-name/',
  // ... rest of config
}

# 2. Add deploy script to package.json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# 3. Install gh-pages
npm install --save-dev gh-pages

# 4. Deploy
npm run deploy
```

**GitHub Settings:**
1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages, folder: root
4. Wait 1-2 minutes

**URL:** https://yourusername.github.io/repository-name

---

### Option 4: Self-Hosted (VPS/Server)

**Best for:** Full control, custom backend, team hosting

#### Setup (Ubuntu/Debian)

```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone repository
git clone https://github.com/yourusername/history-hackathon.git
cd history-hackathon

# 4. Install & build
npm install
npm run build

# 5. Install web server (nginx)
sudo apt-get install -y nginx
```

**Nginx Configuration:** `/etc/nginx/sites-available/archive`

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /path/to/history-hackathon/dist;
    index index.html;
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Setup SSL
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
}
```

**Enable & Start:**

```bash
sudo ln -s /etc/nginx/sites-available/archive /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

**SSL Certificate (free):** [Let's Encrypt](https://letsencrypt.org/)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## ENVIRONMENT VARIABLES

### Create `.env.production`

```
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Your Archive Name
VITE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

### Use in Code

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

---

## MONITORING & MAINTENANCE

### Uptime Monitoring

**Recommended Services:**
- [UptimeRobot](https://uptimerobot.com/) (free)
- [Pingdom](https://www.pingdom.com/)
- [Status.io](https://status.io/)

```bash
# Monitor endpoint
https://yourdomain.com/

# Check every 5 minutes
# Alert if down
```

### Analytics

Add to `src/components/ArchiveApp.jsx`:

```javascript
// Google Analytics
useEffect(() => {
  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID');
  }
}, []);
```

Add to `index.html`:

```html
<!-- Google Analytics -->
<script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

**Recommended:** [Sentry](https://sentry.io/)

```bash
npm install @sentry/react @sentry/tracing
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

---

## PERFORMANCE OPTIMIZATION

### CDN Setup

```bash
# Generate hashed assets (Vite does this automatically)
dist/
├── index.html
├── assets/
│   ├── index-a1b2c3d4.js          (hashed)
│   ├── index-e5f6g7h8.css         (hashed)
│   └── archive-i9j0k1l2.json      (hashed)
```

**Upload to CDN:**
- [Cloudflare](https://www.cloudflare.com/) (free tier available)
- [AWS CloudFront](https://aws.amazon.com/cloudfront/)
- [BunnyCDN](https://bunnycdn.com/)

### Cache Strategy

```
HTML:           no-cache (always fresh)
CSS/JS/Images:  1 year (until hash changes)
JSON data:      1 hour (archive.json)
```

### Compression

Enable gzip/brotli:

```nginx
# Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_comp_level 6;
```

---

## UPDATING CONTENT

### Update Archive Data

```bash
# 1. Edit data/archive.json
{
  "documents": [
    { "id": 1, ... },
    { "id": 2, ... }  // Add/edit
  ]
}

# 2. Commit & push
git add data/archive.json
git commit -m "Update archive data"
git push origin main

# 3. Auto-deployed (Vercel/Netlify)
# Or manually run: npm run build && deploy
```

### Update Styling

```bash
# 1. Edit src/styles/theme.js
export const archiveColors = {
  rust: '#NEW_COLOR',  // Change color
}

# 2. Commit & deploy
git add src/styles/theme.js
git commit -m "Update color theme"
git push origin main
```

### Update Copy

```bash
# 1. Edit src/components/HeroSection.jsx
<h1>New Title Here</h1>

# 2. Commit & deploy
git add src/components/HeroSection.jsx
git commit -m "Update hero copy"
git push origin main
```

---

## ROLLBACK PROCEDURES

### Vercel Rollback

```bash
# List past deployments
vercel log

# Promote previous deployment
vercel promote <deployment-url>
```

### Netlify Rollback

```
Site Settings → Deploys → Choose previous deploy → Publish
```

### GitHub Pages Rollback

```bash
# Revert git commits
git revert HEAD~1

# Force push
git push origin main --force

# Wait 1-2 minutes for redeploy
```

---

## SECURITY CHECKLIST

- [ ] HTTPS enabled (SSL certificate valid)
- [ ] Content Security Policy headers set
- [ ] No sensitive data in build output
- [ ] CORS properly configured
- [ ] Updates checked regularly (npm audit)
- [ ] Rate limiting enabled (if backend API)
- [ ] XSS protection enabled
- [ ] CSRF tokens configured (if forms)

### Update Dependencies Safely

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Fix major versions (manual review needed)
npm audit fix --force

# Update outdated packages
npm outdated
npm update
```

---

## BACKUP STRATEGY

### GitHub Backup
```bash
# Always push to GitHub first
git push origin main
```

### Database Backup (if added)
```bash
# Daily automated backups recommended
# Service: AWS RDS, MongoDB Atlas, etc.
```

### Static Content Backup
```bash
# Keep archive.json in version control
git add data/archive.json
git commit -m "Backup archive data"
```

---

## DOMAIN & DNS SETUP

### Domain Registration
- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)
- Google Domains

### DNS Configuration

**For Vercel:**
```
A Record:    76.76.19.89
CNAME:       yourdomain.vercel.app
```

**For Netlify:**
```
CNAME:       yourdomain.netlify.app
```

**For Custom Server:**
```
A Record:    123.45.67.89  (your server IP)
MX Record:   (if email needed)
```

### SSL Certificate

**Automatic (Vercel/Netlify):** Done automatically ✅

**Manual (Self-hosted):**
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## MONITORING & ALERTS

### Status Page

Create public status page for users:
- [StatusPage.io](https://www.statuspage.io/)
- [Instatus](https://instatus.com/)

Displays:
- ✅ System status
- 📊 Uptime history
- 🔔 Incident reports
- 📅 Maintenance schedule

---

## POST-DEPLOYMENT

### First 24 Hours
- [ ] Monitor for errors (Sentry/logs)
- [ ] Check analytics loading
- [ ] Verify search functionality
- [ ] Test on multiple devices
- [ ] Monitor performance metrics

### Weekly Tasks
- [ ] Check uptime monitoring
- [ ] Review analytics
- [ ] Monitor error rates
- [ ] Check data freshness

### Monthly Tasks
- [ ] Update dependencies (`npm outdated`)
- [ ] Review security alerts
- [ ] Backup data
- [ ] Performance review
- [ ] User feedback review

---

## DISASTER RECOVERY

### Complete Outage

```bash
# 1. Check host status
# Vercel/Netlify dashboard

# 2. Deploy previous version
vercel rollback [version-id]

# OR rebuild from git
git push origin main

# 3. Notify users
# Post to status page
```

### Data Loss

```bash
# Restore from GitHub
git clone https://github.com/yourusername/repo.git

# Restore from backup
# archive.json in version control ✅
```

### Attack/Compromise

```bash
# 1. Rotate secrets
# Update environment variables

# 2. Audit logs
# Check for unauthorized access

# 3. Force redeploy
npm run build
vercel deploy --prod --force
```

---

## COST ESTIMATION

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| **Vercel** | Hobby | Free | Static sites only |
| **Netlify** | Free | Free | 100GB/month bandwidth |
| **GitHub Pages** | - | Free | Public repos only |
| **S3 + CloudFront** | Pay-as-you-go | $5-50/mo | Based on usage |
| **VPS (DigitalOcean)** | Starter | $5-20/mo | Full control |

---

## SUCCESS METRICS

After deployment, track:

| Metric | Target | Tool |
|--------|--------|------|
| Uptime | > 99.9% | UptimeRobot |
| Page Load | < 2s | Lighthouse |
| Search Speed | < 300ms | Custom |
| Error Rate | < 0.1% | Sentry |
| User Satisfaction | > 4/5 stars | Surveys |

---

## SUPPORT & MAINTENANCE

### User Support Channels
- [ ] Email support setup
- [ ] Help documentation
- [ ] FAQ page
- [ ] Contact form
- [ ] Social media monitoring

### Maintenance Window

Schedule occasional maintenance:

```
Maintenance Window: Sundays 2 AM - 4 AM UTC
Notify users 24 hours in advance
Keep downtimes under 30 minutes
```

---

## ADDITIONAL RESOURCES

- [Vite Deployment Guide](https://vitejs.dev/guide/ssr.html)
- [React Production Best Practices](https://react.dev/learn/react-18-upgrade-guide)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Your Intelligent Archival Search System is now production-ready!** 🎉

For questions, refer to README.md, ARCHITECTURE.md, or QUICKSTART.md.
