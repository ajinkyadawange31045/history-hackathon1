# ⚡ QUICK START GUIDE

Get the Intelligent Archival Search System running in **5 minutes**.

---

## STEP 1: Install Dependencies (1 min)

```bash
# Navigate to project directory
cd history-hackathon

# Install all packages
npm install

# Wait for completion (~1-2 minutes on first run)
```

**What gets installed:**
- React 18 + ReactDOM
- Vite (build tool)
- Tailwind CSS + PostCSS
- All development dependencies

---

## STEP 2: Start Development Server (1 min)

```bash
npm run dev
```

**Expected output:**
```
  VITE v4.3.0  ready in 421 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

The browser **automatically opens** to `http://localhost:3000`

---

## STEP 3: Explore the Interface (2 min)

### Hero Section
- See large search bar with warm gradient background
- Title: "Explore the Archives of Time"

### Try a Search
```
Type: "navy"
Press: Enter or just wait
```

You'll see results like:
- "Experimental Frigate Vernon at Sea" (top result)
- Scored by relevance

### Try Filters
1. On **Desktop**: Look left → Filters sidebar
2. On **Mobile**: Click "Filters" button → Drawer slides in

Check a filter:
```
✓ Document Type: "painting"
  (Shows only paintings)
```

Combine filters + search:
```
Search: "map"
Filter: Region = "India"
(Shows maps of India)
```

### Result Cards
Click any result card to:
- Expand for full details
- See author, collection, keywords
- View all metadata

---

## STEP 4: Test Search Examples

Copy these into the search bar:

| Query | What Happens |
|-------|--------------|
| `navy` | Maritime documents ranked first |
| `trade` | Commerce-related items |
| `map` | Only maps |
| `persian gulf` | Multi-word search |
| `british` | Finds British institutions, authors |
| `painting` | Document type search |

**Tip:** The search is:
- ✅ Case-insensitive
- ✅ Partial matching (fuzzy)
- ✅ Multi-field (title, description, subjects, etc.)

---

## STEP 5: Build for Production (when ready)

```bash
npm run build
```

**Output:** `dist/` folder with optimized files

Ready for:
- Vercel: `vercel deploy`
- Netlify: Drag `dist/` folder
- GitHub Pages: Push to gh-pages

---

## 📁 File Structure (Important Files)

```
src/
├── components/
│   ├── ArchiveApp.jsx          ← Main component
│   ├── HeroSection.jsx         ← Search/hero
│   ├── FilterSidebar.jsx       ← Filters
│   └── DocumentCard.jsx        ← Result cards
├── utils/
│   ├── searchAlgorithm.js     ← Search logic
│   ├── filterLogic.js          ← Filter logic
├── styles/
│   ├── globals.css             ← Global styles
│   ├── theme.js                ← Colors & theme
└── data/
    └── archive.json            ← Your data

index.html                       ← Entry point
tailwind.config.js              ← Styling config
vite.config.js                  ← Build config
```

---

## 🎨 Customize Colors

**Easy way:**

1. Open `src/styles/theme.js`
2. Find `archiveColors` object:

```javascript
export const archiveColors = {
  parchment: '#F5F1E8',    // ← Change these
  darkBrown: '#5C4033',
  rust: '#A0522D',
  // ... etc
};
```

3. Update hex colors to your brand
4. Save → Refreshes automatically!

**Example:** Change all rust accents to blue
```javascript
rust: '#2563EB',  // Change from #A0522D
```

---

## 🔍 Debug Search Results

Open browser Developer Tools (F12):

```javascript
// Try in console:
const data = await import('./src/data/archive.json');
console.log('Documents:', data.documents);
console.log('Total:', data.documents.length);

// Test search scoring
const { searchDocuments } = await import('./src/utils/searchAlgorithm.js');
const results = searchDocuments(data.documents, 'navy');
console.log(results); // See scores
```

---

## 🚀 Common Tasks

### Change Hero Title
File: `src/components/HeroSection.jsx`

```javascript
<h1>Your New Title Here</h1>
```

### Add More Documents
Add to `data/archive.json` in the `documents` array

### Change Page Colors
File: `src/styles/theme.js`

Edit `archiveColors` object

### Add New Filter Type
Files to modify:
1. `src/utils/filterLogic.js` → Add to `extractFilterOptions()`
2. `src/components/FilterSidebar.jsx` → Add checkbox group
3. `src/hooks/useArchiveSearch.js` → Update filter state

---

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- --port 3001
```

### Styles Not Updating
1. Check browser cache (Ctrl+Shift+Del)
2. Restart dev server: Stop (Ctrl+C) then `npm run dev`
3. Verify Tailwind classes are spelled correctly

### Search Not Working
1. Check `data/archive.json` exists in correct location
2. Open DevTools console for errors
3. Verify JSON is valid format

### Build Fails
```bash
# Clear node_modules cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📱 Test Responsiveness

### Desktop View
- Open in browser → Max width
- Filters appear in left sidebar
- Full layout

### Mobile View
1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select "iPhone 12" or "Pixel 5"
4. See mobile layout:
   - Filters button → Opens drawer
   - Search bar full width
   - Results full width

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Cmd/Ctrl + K` | Focus search input |
| `Escape` | Close mobile filters |
| `Enter` | Submit search |

---

## 📊 Performance Tips

### For Large Datasets (>5000 documents)
1. Consider implementing virtualization:
   ```javascript
   npm install react-window
   ```
2. Implement pagination instead of infinite scroll

### Improve Search Speed
- Increase debounce delay (currently 300ms):
  ```javascript
  // In useArchiveSearch.js
  setTimeout(() => {
    setDebouncedQuery(query);
  }, 500); // ← From 300 to 500
  ```

---

## 🎓 Learn More

- **Search Algorithm Details**: See `ARCHITECTURE.md`
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite Guide**: https://vitejs.dev/guide/

---

## ✅ Checklist

Before deploying:

- [ ] Tested search with various queries
- [ ] Tested filters (desktop + mobile)
- [ ] Verified responsive design
- [ ] Customized colors & branding
- [ ] Updated hero title/subtitle
- [ ] Confirmed data loads correctly
- [ ] Tested on mobile device
- [ ] Built with `npm run build`

---

## 🎉 You're All Set!

The Intelligent Archival Search System is **production-ready** and waiting for your archive data.

**Next steps:**
1. ✅ Customize branding & colors
2. ✅ Test with your data
3. ✅ Deploy to Vercel/Netlify
4. ✅ Share with archive users

Happy archiving! 📚✨

---

## Need Help?

Check these files:
- **Architecture**: `ARCHITECTURE.md`
- **Full Docs**: `README.md`
- **Component Code**: `src/components/`
- **Utilities**: `src/utils/`

All code is fully commented for easy modification.
