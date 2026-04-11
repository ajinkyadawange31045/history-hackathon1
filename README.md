# 📚 Intelligent Archival Search System

A **production-quality** React-based archival search interface inspired by the **Qatar Digital Library**, combining powerful search capabilities with a distinctive **historical aesthetic**.

---

## 🎨 Design Philosophy

### Why Historical Aesthetic?
This isn't a generic SaaS dashboard—it's a **digital archive museum**. The UI embodies:

- **Serif Typography** (Playfair Display) → scholarly legitimacy
- **Warm Color Palette** (beige, sepia, rust) → aged documents
- **Soft Shadows & Rounded Borders** → stacked paper aesthetic
- **Aged Paper Texture** → historical authenticity
- **Document Card Design** → archival record feel

**Result:** A platform that feels like history stepped into the modern web.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ArchiveApp.jsx          # Main orchestrator component
│   ├── HeroSection.jsx          # Hero + Sticky search bar
│   ├── FilterSidebar.jsx        # Desktop/Mobile filters
│   └── DocumentCard.jsx         # Result cards + grid
├── hooks/
│   └── useArchiveSearch.js      # State management hooks
├── utils/
│   ├── searchAlgorithm.js       # Three-tier scoring system
│   ├── filterLogic.js            # Multi-filter logic
├── styles/
│   ├── globals.css              # Global styling
│   └── theme.js                 # Color tokens & Tailwind utilities
├── data/
│   └── archive.json             # Archival dataset
├── App.jsx                       # Root wrapper
└── main.jsx                      # React entry point

Configuration Files:
├── vite.config.js               # Vite build config
├── tailwind.config.js           # Tailwind CSS config
├── postcss.config.js            # PostCSS config
├── package.json                 # Dependencies
└── index.html                   # HTML entry point
```

---

## 🔍 SEARCH ALGORITHM EXPLAINED

### Three-Tier Relevance Scoring System

The search algorithm uses weighted scoring across multiple fields:

#### 1. **Field Weighting**
```javascript
weights = {
  title: 4,        // Highest priority
  subjects: 2.5,
  keywords: 2,
  tags: 1.5,
  description: 1,
  author: 0.8,
  place: 0.8,
}
```

#### 2. **Match Scoring**
For each field, matches are scored based on type:

```
Exact match (field == query)           → 100 points × weight
Starts with (field.startsWith query)   → 75 points × weight
Exact word match (query in words)      → 60 points × weight
Contains text (includes query)          → 40 points × weight
Fuzzy match (char sequence)            → 20 points × weight
```

#### 3. **Example Scoring**
Search for "**navy**":

```
Document: "Experimental Frigate Vernon at Sea"
- Title contains "navy" (word match): 100 × 4 = 400 points
- Subjects include "navy": 100 × 2.5 = 250 points
- Frequency boost: +10 (appears in title)
TOTAL: 660 points

Result: Ranked #1
```

### Key Features
- ✅ **Case-insensitive** matching
- ✅ **Partial matching** (fuzzy support)
- ✅ **Term frequency boost** for relevance
- ✅ **Multi-field scoring** with weights
- ✅ **Real-time debouncing** (300ms)

### Usage
```javascript
import { searchDocuments } from './utils/searchAlgorithm';

const results = searchDocuments(documents, 'trade routes');
// Returns: Documents sorted by relevance score
```

---

## 🎛️ FILTER SYSTEM

### Multi-Select Filtering
Filters use **AND logic**: all selected filters must match.

#### Available Filter Categories
1. **Document Type** (painting, map, letter, etc.)
2. **Region** (Middle East, India, Europe, etc.)
3. **Language** (English, Arabic, etc.)
4. **Subjects** (navy, trade, navigation, etc.)
5. **Holding Institution** (British Library, Qatar National Library, etc.)

### Filter Logic
```javascript
// Applied AFTER search results
filtered = searchResults.filter(doc => {
  // Document type
  if (filters.types.length > 0 && !filters.types.includes(doc.type))
    return false;
  
  // Region
  if (filters.regions.length > 0 && !filters.regions.includes(doc.region))
    return false;
  
  // Subjects (OR logic within array)
  if (filters.subjects.length > 0) {
    const hasSubject = filters.subjects.some(s => doc.subjects.includes(s));
    if (!hasSubject) return false;
  }
  
  return true;
});
```

### Implementation
```javascript
import { applyFilters, toggleFilterOption } from './utils/filterLogic';

// Toggle a filter
const newFilters = toggleFilterOption(filters, 'types', 'painting');

// Apply filters to results
const filtered = applyFilters(results, filters);
```

---

## 🏛️ COMPONENT ARCHITECTURE

### `ArchiveApp.jsx` - Main Orchestrator
- Manages overall state
- Coordinates search + filters + UI
- Handles keyboard shortcuts (Cmd+K, Escape)
- Responsive layout (desktop sidebar / mobile drawer)

### `HeroSection.jsx`
- **Hero Banner**: Large search input with warm gradient background
- **Sticky Search**: Compact search bar that appears after scrolling
- Smooth transitions between states

### `FilterSidebar.jsx`
- **Desktop**: Fixed left sidebar (min-width: 768px)
- **Mobile**: Collapsible drawer with backdrop
- Expandable sections (click to show/hide)
- Real-time filter count display

### `DocumentCard.jsx`
- Individual document display
- Click to expand for full details
- Shows: title, type badge, date, place, institution
- Subjects, tags, keywords with visual styling

### `useArchiveSearch.js` Hook
```javascript
const {
  query, setQuery,              // Search state
  filters, toggleFilter,         // Filter state
  results, totalResults,         // Search results
  clearSearch, clearFilters,     // Actions
  sortBy, setSortBy,            // Sorting
} = useArchiveSearch(documents, metadata);
```

### `useArchiveUI.js` Hook
```javascript
const {
  isFilterDrawerOpen,           // Mobile drawer state
  toggleFilterDrawer,           // Open/close drawer
  isSticky,                     // Scroll position
  scrollPosition,               // Current Y position
} = useArchiveUI();
```

---

## 🎨 STYLING & THEME

### Color Palette
```javascript
archiveColors = {
  parchment: '#F5F1E8',      // Page background
  cream: '#FAF8F3',          // Cards
  sepia: '#D4AF8F',          // Borders
  darkBrown: '#5C4033',      // Primary text
  rust: '#A0522D',           // Accents & buttons
  gold: '#D4AF37',           // Highlights
}
```

### Tailwind Classes
Pre-defined compositions for consistency:

```javascript
archiveClasses = {
  card: 'bg-parchment border border-sepia/30 shadow-lg ...',
  headingXL: 'font-serif text-4xl font-bold text-darkBrown',
  badge: 'inline-block px-3 py-1 text-xs ... bg-gold/20 ...',
  buttonPrimary: 'bg-rust hover:bg-rust/90 text-cream ...',
  input: 'w-full px-4 py-3 bg-cream border border-sepia/50 ...',
}
```

### Custom Fonts
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px+

### Mobile-First Layout
```
Mobile:   [Search Bar] → [Filter Drawer] + [Results]
Tablet:   [Sidebar (Collapsible)] + [Results]
Desktop:  [Sidebar (Fixed)] + [Results]
```

### Touch-Friendly
- Larger tap targets (44px minimum)
- Smooth animations on touch
- Accessible filter drawer with backdrop

---

## ⌨️ KEYBOARD SHORTCUTS

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Focus search input |
| `Escape` | Close filter drawer (mobile) |
| `Enter` | Submit search |

---

## 🔧 CUSTOMIZATION

### Change Color Theme
Edit `src/styles/theme.js`:

```javascript
export const archiveColors = {
  parchment: '#Your_Color',
  darkBrown: '#Your_Color',
  // ...
};
```

### Add New Filter Categories
1. Add to `extractFilterOptions()` in `filterLogic.js`
2. Add checkbox group to `FilterSidebar.jsx`
3. Add filter logic in `applyFilters()`

### Modify Search Weights
In `searchAlgorithm.js`, adjust the `weights` object:

```javascript
const weights = {
  title: 4,      // ← Increase for title-focused search
  subjects: 2.5,
  // ...
};
```

---

## 🧪 TESTING THE SEARCH

### Test Query Examples
```javascript
// Valid searches
'navy'              → Finds maritime documents
'trade'             → Finds commerce-related items
'map*'              → Finds maps (fuzzy)
'persian gulf'      → Multi-word search
'1834'              → Date-based search (via keywords)
'british library'   → Institution search
```

### Browser Console Testing
```javascript
// Open DevTools and try:
const { searchDocuments } = await import('./utils/searchAlgorithm.js');
const results = searchDocuments(data.documents, 'navy');
console.log(results); // Check results with scores
```

---

## 📊 PERFORMANCE OPTIMIZATION

### Memoization
```javascript
// Results useMemo prevents unnecessary recalculations
const results = useMemo(() => {
  let filtered = searchDocuments(documents, query);
  return applyFilters(filtered, filters);
}, [query, filters, documents]);
```

### Debounced Search
```javascript
// 300ms delay prevents excessive re-renders
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(query);
  }, 300);
  return () => clearTimeout(timer);
}, [query]);
```

### Lazy Loading
Document cards render progressively as user scrolls.

---

## 🐛 DEBUGGING

### Enable Logging
```javascript
// In useArchiveSearch.js
console.log('Search Results:', results);
console.log('Active Filters:', filters);
```

### Inspect Data
```javascript
// Check dataset structure
import data from './data/archive.json';
console.log('Documents:', data.documents);
console.log('Metadata:', data.metadata);
```

### CSS Issues
- Check browser DevTools → Elements tab
- Verify Tailwind classes are generated
- Check `tailwind.config.js` content paths

---

## 📦 DEPLOYMENT

### Production Build
```bash
npm run build
# Output: dist/ (ready for production)
```

### Deploy Options
- **Vercel** (recommended for React):
  ```bash
  npm install -g vercel
  vercel
  ```

- **Netlify**:
  ```bash
  npm run build
  # Drag dist/ folder to Netlify
  ```

- **GitHub Pages**:
  ```bash
  npm run build
  # Push dist/ to gh-pages branch
  ```

---

## 📖 UX/UI DECISIONS

### Why Historical Aesthetic?
1. **Differentiation**: Stands out from generic dashboards
2. **Authenticity**: Matches archival subject matter
3. **Trust**: Scholarly feel builds credibility
4. **Engagement**: Unique visual identity improves retention

### Why Serif Headings?
- Associates with manuscripts & authority
- Better readability at larger sizes
- Historical authenticity

### Why Warm Colors?
- Aged paper associations
- Warm color schemes feel welcoming
- Sepia tones evoke historical documents

### Why Soft Shadows?
- Stacked paper effect
- Depth without harshness
- Gentle, scholarly feel

---

## 🤝 CONTRIBUTING

To extend the system:

1. **Add new filters**: Modify `filterLogic.js` + `FilterSidebar.jsx`
2. **Improve search**: Adjust weights in `searchAlgorithm.js`
3. **New components**: Add to `src/components/`
4. **Styling**: Update `src/styles/theme.js`

---

## 📄 LICENSE

Production prototype. Designed for historical archives and cultural heritage institutions.

---

## 🎓 LEARNING RESOURCES

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Web Accessibility (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 👨‍💻 TECHNICAL STACK SUMMARY

| Layer | Technology |
|-------|-----------|
| Frontend | React 18+ |
| Styling | Tailwind CSS 3 |
| Build Tool | Vite 4 |
| Fonts | Google Fonts (Playfair Display) |
| State | React Hooks (useState, useMemo, useCallback) |
| Search | Custom algorithm (weighted scoring) |
| Responsive | Mobile-first CSS + Media queries |

---

## ✨ FEATURES OVERVIEW

| Feature | Status | Details |
|---------|--------|---------|
| Multi-field Search | ✅ | Title, description, subjects, keywords |
| Weighted Scoring | ✅ | Relevance-based ranking |
| Partial Matching | ✅ | Fuzzy matching support |
| Multi-select Filters | ✅ | Type, Region, Language, Subjects, Institution |
| Responsive Design | ✅ | Mobile drawer, desktop sidebar |
| Sticky Search | ✅ | Accessible while browsing |
| Document Expandable | ✅ | Click to see full details |
| Dark Mode | 🔄 | Can be added via theme toggle |
| Export Results | 🔄 | Can be implemented for CSV/JSON |

---

## 🎯 Next Steps

1. **Test with your data**: Ensure `archive.json` structure matches
2. **Customize colors**: Edit `src/styles/theme.js`
3. **Add branding**: Update hero title and footer text
4. **Deploy**: Follow deployment instructions above
5. **Gather feedback**: Test with actual archive users

---

**Ready to explore the archives?** 📚✨
