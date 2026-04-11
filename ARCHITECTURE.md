# ARCHITECTURE GUIDE

## Intelligent Archival Search System - Technical & Design Overview

---

## 🏛️ SYSTEM ARCHITECTURE

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                           │
│  (Search Input / Filter Toggle / Document Click)               │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   useArchiveSearch     │
                    │   (React Hook)          │
                    │  - Query State          │
                    │  - Filter State         │
                    │  - Sort State           │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
      ┌──────────▼──────────┐       ┌───────────▼──────────┐
      │ searchAlgorithm.js  │       │ filterLogic.js       │
      │ (300ms debounced)   │       │ (real-time)          │
      │ - Scoring           │       │ - Multi-select AND   │
      │ - Weighting         │       │ - Array OR logic     │
      │ - Relevance         │       │ - Filtering          │
      └──────────┬──────────┘       └───────────┬──────────┘
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Memoized Results      │
                    │   (useMemo)             │
                    │ Prevents recalc on      │
                    │ unrelated state change  │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Component Rendering   │
                    │  - HeroSection         │
                    │  - FilterSidebar       │
                    │  - ResultsGrid         │
                    │  - DocumentCards       │
                    └────────────────────────┘
```

---

## 🧠 SEARCH ALGORITHM DEEP DIVE

### Algorithm Overview: Three-Tier Relevance Scoring

#### TIER 1: Field Selection
Selected searchable fields with importance weights:

```
searchable_fields = {
  title: 4.0,           // Highest weight (exact titles matter most)
  subjects: 2.5,        // High (structured metadata)
  keywords: 2.0,        // Medium-high
  tags: 1.5,            // Medium
  description: 1.0,     // Medium (full text search)
  author: 0.8,          // Low-medium (author searches less common)
  place: 0.8,           // Low-medium
}
```

#### TIER 2: Match Type Detection
For each field, detect match quality:

```javascript
Match Hierarchy:
  1. EXACT MATCH (field === query)
     Score: 100 × field_weight
     Example: Query "map", Title "Map of Western India"
     
  2. STARTS_WITH (field.startsWith(query))
     Score: 75 × field_weight
     Example: Query "map", Keywords ["mapping", "maps"]
     
  3. WORD_MATCH (query appears as word in field)
     Score: 60 × field_weight
     Example: Query "navy", Title "Navy Ships in Persian Gulf"
     
  4. CONTAINS (field.includes(query))
     Score: 40 × field_weight
     Example: Query "Per", Place "Persian Gulf"
     
  5. FUZZY (characters in order but not contiguous)
     Score: 20 × field_weight
     Example: Query "nav", Field "Navy" → n-a-v found in sequence
```

#### TIER 3: Relevance Boosters
Additional factors that influence final ranking:

```javascript
Term Frequency Bonus:
  - Each occurrence in title: +10 bonus
  - Each occurrence in description: +5 bonus
  - Rewards documents where search term appears multiple times

Example Scoring Calculation:
┌──────────────────────────────────────────────────────────┐
│ Search Query: "navy trade"                               │
├──────────────────────────────────────────────────────────┤
│ Document: "Maritime Trading Navy Routes"                 │
│                                                          │
│ Field Scores:                                            │
│   Title contains "navy": 40 × 4.0 = 160 pts            │
│   Title contains "trade": 40 × 4.0 = 160 pts           │
│   Keywords ["navy", "trade"]: 100 × 2.0 = 200 pts     │
│   Frequency (navy × 1 in title): +10 bonus             │
│                                                          │
│ TOTAL: 160 + 160 + 200 + 10 = 530 points               │
└──────────────────────────────────────────────────────────┘
```

### Implementation: searchAlgorithm.js

```javascript
scoreDocument(document, "navy") {
  1. Normalize query → "navy"
  2. For each field:
     - titleScore = scoreField(doc.title, "navy", 4.0)
     - subjectsScore = scoreArrayField(doc.subjects, "navy", 2.5)
     - etc.
  3. Sum all field scores
  4. Add frequency bonus
  5. Return total score
  
  Result: Numeric score (higher = more relevant)
}
```

### Key Properties

| Property | Value | Rationale |
|----------|-------|-----------|
| Field Weights | 1.0 - 4.0 | Title > Subjects > Description |
| Debounce Delay | 300ms | Balance responsiveness vs. performance |
| Fuzzy Match | Enabled | Accept "nav" > "navy" |
| Case Sensitivity | Off | "Navy" = "navy" |
| Min Score Threshold | 0 (no threshold) | Don't hide low-score results |

---

## 🎛️ FILTER SYSTEM ARCHITECTURE

### Filter State Structure

```javascript
filters = {
  types: [],              // Multi-select array
  dateRange: {
    start: null,
    end: null,
  },
  regions: [],            // Multi-select array
  languages: [],          // Multi-select array
  subjects: [],           // Multi-select array (OR logic)
  institutions: [],       // Multi-select array
}
```

### Filter Logic: AND vs OR

```javascript
// MULTI-CATEGORY: AND Logic
  Selected: types=["painting", "map"], regions=["India"]
  Result: (type is painting OR type is map) AND region is India
  
// WITHIN-CATEGORY: OR Logic
  Selected: subjects=["trade", "navy"]
  Result: subject includes "trade" OR subject includes "navy"

// Combined:
  If (type matches selected types)
    AND (region matches selected regions)
    AND (subject in selected subjects)
    ...
  THEN include document
```

### Application Order

```
Step 1: Search (searchAlgorithm.js)
  Input: raw documents + query
  Output: scored & sorted documents
  
Step 2: Filter (filterLogic.js)
  Input: search results + filter state
  Output: filtered documents
  
Step 3: Sort
  Input: filtered documents + sortBy preference
  Output: final results
```

---

## ⚛️ REACT COMPONENT HIERARCHY

```
ArchiveApp (Main Orchestrator)
├── HeroSection
│   ├── Hero Banner (with gradient background)
│   └── Search Input
├── StickySearchBar (visible after scroll)
├── FilterSidebar (Desktop only)
│   ├── Checkbox Groups
│   │   ├── Types
│   │   ├── Regions
│   │   ├── Languages
│   │   ├── Subjects
│   │   └── Institutions
│   └── Clear Filters Button
├── FilterDrawer (Mobile only)
│   ├── Backdrop (click to close)
│   └── FilterSidebar (reused)
└── Main Results Section
    ├── Filter Toggle Button (mobile)
    ├── Results Count
    ├── Reset All Button
    └── ResultsGrid
        └── DocumentCard (per result)
            ├── Type Badge
            ├── Date
            ├── Title
            ├── Description
            ├── Metadata (Place, Institution)
            ├── Tags/Subjects
            └── Expandable Details
```

---

## 🪝 React Hooks Strategy

### useArchiveSearch (Custom Hook)

```javascript
Hook State:
  - query: string (debounced)
  - filters: object
  - sortBy: string
  - debouncedQuery: string (300ms delay)

Hook Behavior:
  useMemo → Compute results when:
    ✓ debouncedQuery changes
    ✓ filters change
    ✓ sortBy changes
    ✓ documents change
  
  NOT when other component state changes
  
Hook Returns:
  - query, setQuery
  - filters, toggleFilter, clearFilters
  - results (memoized array)
  - sortBy, setSortBy
```

### useArchiveUI (Custom Hook)

```javascript
Hook State:
  - isFilterDrawerOpen: boolean
  - isSticky: boolean (derived from scroll)
  - scrollPosition: number

Hook Listeners:
  - 'scroll' event listener (passive: true for perf)
  - Triggers when scrollY > 400px

Hook Returns:
  - isFilterDrawerOpen, toggleFilterDrawer
  - isSticky (triggers sticky search bar)
```

### Built-in Hooks Used

```javascript
useState          → Query, filters, UI state
useMemo           → Computed results (prevent recalc)
useCallback       → Event handlers (stable references)
useEffect         → Scroll listener, keyboard shortcuts
```

---

## 🎨 STYLING ARCHITECTURE

### Tailwind + Custom Theme

#### Color System
```javascript
// src/styles/theme.js → Exported as archiveColors
colors = {
  parchment: '#F5F1E8',    // Background
  cream: '#FAF8F3',        // Card background
  sepia: '#D4AF8F',        // Borders, dividers
  darkBrown: '#5C4033',    // Primary text
  lightBrown: '#8B7355',   // Secondary text
  rust: '#A0522D',         // CTA buttons, accents
  gold: '#D4AF37',         // Highlights, badges
}
```

#### Predefined Class Combinations
```javascript
// src/styles/theme.js → Exported as archiveClasses
classes = {
  card: 'bg-parchment border border-sepia/30 shadow-lg ...',
  headingXL: 'font-serif text-4xl font-bold text-darkBrown',
  buttonPrimary: 'bg-rust hover:bg-rust/90 text-cream ...',
  badge: 'inline-block px-3 py-1 text-xs ... bg-gold/20 ...',
  // ... more combinations
}
```

### Responsive Breakpoints
```javascript
Mobile:   < 640px   (md: prefix NOT applied)
Tablet:   640-1024px (md: prefix applied)
Desktop:  > 1024px   (lg: prefix applied)

Usage:
  md:flex       → Hidden on mobile, flex on tablet+
  lg:w-80       → Not applied on mobile/tablet, applied on desktop
  md:hidden      → Visible on mobile, hidden on tablet+
```

---

## 📊 DATA FLOW EXAMPLE

### User Types "navy"

```
1. User Input
   └─ onChange event in search input
      └─ setQuery("navy")

2. Debounce (300ms timer)
   └─ Wait 300ms for more typing...
   └─ No more input → debouncedQuery = "navy"

3. useMemo Triggers
   └─ Dependency: debouncedQuery changed
   └─ Call searchDocuments(documents, "navy")
      └─ Score each document
      └─ Filter score > 0
      └─ Sort by relevance
   └─ Return: [doc1, doc2, doc3, ...]

4. Apply Filters
   └─ applyFilters(searchResults, filters)
   └─ Return: filtered documents

5. Render Results
   └─ ComponentCard renders each result
   └─ User sees: "Experimental Frigate Vernon at Sea"
      (scored highest because "navy" in subjects + keywords)
```

### User Selects Filter "Region: India"

```
1. User Clicks Checkbox
   └─ onChange event
   └─ toggleFilter("regions", "India")

2. Filters State Updates
   └─ filters.regions = ["India"]

3. useMemo Triggers (dependency: filters)
   └─ Search results still same (query unchanged)
   └─ applyFilters(searchResults, filters)
   └─ Now only documents in India shown

4. Render
   └─ ResultsGrid re-renders
   └─ DocumentCards update to show only Indian documents
```

---

## ⚡ PERFORMANCE OPTIMIZATIONS

### 1. Memoization (useMemo)
```javascript
// WITHOUT memoization: recalculates on EVERY render
const results = searchDocuments(documents, query);

// WITH memoization: recalculates ONLY when dependencies change
const results = useMemo(() => {
  return searchDocuments(documents, query);
}, [documents, query]);
```

### 2. Debouncing (Search)
```javascript
// Without: Search on every keystroke (expensive)
// With: Wait 300ms after user stops typing
// Result: Same relevance, fewer calculations

// Example: User types "n" → "na" → "nav" → "navy"
// Without: 4 searches
// With: 1 search (after delay)
// ≈ 4x performance improvement
```

### 3. Callback Stability (useCallback)
```javascript
// Prevents unnecessary re-renders of child components
const toggleFilter = useCallback((category, value) => {
  setFilters(prev => ({ ...prev }));
}, []); // Empty deps = function created once
```

### 4. Lazy Rendering
```javascript
// DocumentCards render in grid without virtualization
// Fine for ~100 documents, but can use react-window
// if dataset grows > 1000
```

---

## 🔐 DATA INTEGRITY

### Immutability Pattern
```javascript
// DON'T: Mutate state directly
filters.types.push("painting"); ❌ WRONG

// DO: Return new object
setFilters(prev => ({
  ...prev,
  types: [...prev.types, "painting"]
})); ✅ CORRECT
```

### Search Non-Destructive
```javascript
// searchDocuments() doesn't modify original array
const results = searchDocuments(documents, query);
// documents array unchanged ✅
```

---

## 🚨 ERROR HANDLING

### Invalid Data
```javascript
// Graceful fallbacks
const documents = data?.documents || [];
const metadata = data?.metadata || {};

// Safe array access
doc.subjects?.map(s => s) // Optional chaining
```

### Edge Cases
```javascript
// Empty search
if (!query || !query.trim()) return documents;

// No results
if (documents.length === 0) {
  return <div>No results found</div>;
}

// Missing document fields
const author = document.author || 'Unknown';
```

---

## 📱 RESPONSIVE STRATEGY

### Mobile First
```css
/* Base: Mobile */
.sidebar { display: none; }

/* Tablet+ */
@media (min-width: 768px) {
  .sidebar { display: block; }
}

/* Desktop */
@media (min-width: 1024px) {
  .sidebar { width: 320px; }
}
```

### Viewport Handling
```html
<meta name="viewport" 
      content="width=device-width, initial-scale=1.0" />
```

### Touch Optimization
```javascript
// Larger tap targets
min height & width: 44px

// Smooth animations
transition: all 0.3s ease-in-out

// No :hover on touch devices
@media (hover: none) {
  // Remove hover-only styles
}
```

---

## 🔄 STATE MANAGEMENT FLOW

### Unidirectional Data Flow
```
Parent (ArchiveApp)
  ├─ State: query, filters, sortBy
  └─ Props: to children
      ├─ HeroSection (receives: query, setQuery)
      ├─ FilterSidebar (receives: filters, toggleFilter)
      └─ ResultsGrid (receives: results)
         └─ DocumentCard (no state, just display)
         
Changes:
  User Input → Event Handler → setState → Re-render
```

### No Prop Drilling
```javascript
// ✅ GOOD: Pass data to direct children
<ArchiveApp>
  <FilterSidebar filters={filters} />
  <ResultsGrid results={results} />
</ArchiveApp>

// ❌ BAD: Passing through multiple levels
<ArchiveApp>
  <Wrapper>
    <Layout>
      <FilterSidebar filters={filters} />
    </Layout>
  </Wrapper>
</ArchiveApp>
```

---

## 📚 EXTENDING THE SYSTEM

### Add New Search Field
1. Add to `weights` in `searchAlgorithm.js`
2. Call `scoreField()` for the new field
3. Sum into `totalScore`

### Add New Filter Category
1. Add to `filters` object shape in `useArchiveSearch.js`
2. Add checkbox group in `FilterSidebar.jsx`
3. Add condition in `applyFilters()` in `filterLogic.js`

### Add Sorting Option
1. Add case to sort logic in `useMemo`
2. Add radio button option in results header
3. Update `sortBy` state

---

## 🎯 DESIGN RATIONALE

### Why Serif Fonts?
- Historical documents use serifs
- Formal, trustworthy appearance
- Better readability at large sizes

### Why Warm Colors?
- Aged paper (beige, sepia)
- Warm feel (rust, gold)
- Reduce blue light (less eye strain)

### Why Large Hero Search?
- First interaction point
- Encourages exploration
- Modern UX pattern (Google, Udemy)

### Why Sidebar on Desktop?
- Familiar layout
- Doesn't obscure results
- Easy filter at-a-glance

### Why Mobile Drawer?
- Uses screen space efficiently
- Smooth slide-in animation
- Industry standard pattern

---

## Summary

The Intelligent Archival Search System combines:
- **Smart Search**: Weighted multi-field relevance scoring
- **Flexible Filtering**: Multi-select with AND/OR logic
- **Responsive UI**: Mobile drawer, desktop sidebar
- **Historical Aesthetic**: Serif fonts, warm colors, aged paper feel
- **Performance**: Memoization, debouncing, efficient rendering

Result: A production-ready platform that's both powerful and beautiful. 📚✨
