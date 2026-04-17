/**
 * REFINED MULTI-WORD SEARCH ALGORITHM
 * 
 * This algorithm:
 * 1. Splits the search query into individual words (piercing).
 * 2. Processes each word independently.
 * 3. Searches across ALL fields (title, description, author, place, etc.).
 * 4. Calculates a relevance score based on how many words matched.
 * 5. Supports both "Strict" (All words must match) and "Smart" (Any word matches, sorted by relevance) searches.
 */

/**
 * Normalize text for comparison: lowercase, trim, remove extra spaces
 */
export const normalizeQuery = (query) => {
  if (!query) return '';
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
};

/**
 * Get all searchable text from a document
 */
const getDocumentSearchText = (doc) => {
  const fields = [
    doc.title,
    doc.description,
    doc.author,
    doc.place,
    doc.region,
    doc.type,
    doc.format,
    doc.collection,
    doc.language,
    doc.holdingInstitution,
    ...(doc.subjects || []),
    ...(doc.keywords || []),
    ...(doc.tags || []),
  ];
  
  return fields
    .filter(val => val !== null && val !== undefined)
    .map(val => String(val).toLowerCase())
    .join(' ');
};

/**
 * Main search function
 */
export const searchDocuments = (documents, query, options = {}) => {
  const { 
    strict = false, // If true, ALL words must match
    searchField = 'all' 
  } = options;

  if (!query || !query.trim()) {
    return documents;
  }

  // Split query into words
  const words = normalizeQuery(query).split(' ').filter(w => w.length > 0);
  if (words.length === 0) return documents;

  // Process each document
  const scoredDocuments = documents.map(doc => {
    let searchText = '';
    
    // Determine what text to search
    if (searchField === 'all') {
      searchText = getDocumentSearchText(doc);
    } else {
      // Search specific field if provided
      const val = doc[searchField];
      if (Array.isArray(val)) {
        searchText = val.join(' ').toLowerCase();
      } else {
        searchText = String(val || '').toLowerCase();
      }
    }

    // Count matches
    let matchCount = 0;
    const matches = words.map(word => {
      const isMatch = searchText.includes(word);
      if (isMatch) matchCount++;
      return isMatch;
    });

    // For relevance sorting
    return {
      ...doc,
      _searchScore: matchCount,
      _allWordsMatched: matchCount === words.length
    };
  });

  // Filter based on strictness
  let results = scoredDocuments.filter(doc => {
    if (strict) {
      return doc._allWordsMatched;
    }
    return doc._searchScore > 0;
  });

  // Sort by relevance (match count)
  results.sort((a, b) => {
    // Primary sort: match count
    if (b._searchScore !== a._searchScore) {
      return b._searchScore - a._searchScore;
    }
    
    // Secondary sort: prefer title match
    const aTitleMatch = a.title.toLowerCase().includes(normalizeQuery(query));
    const bTitleMatch = b.title.toLowerCase().includes(normalizeQuery(query));
    if (aTitleMatch !== bTitleMatch) return bTitleMatch ? 1 : -1;

    return 0; // Maintain original order otherwise
  });

  // Clean up internal properties
  return results.map(doc => {
    const { _searchScore, _allWordsMatched, ...cleanDoc } = doc;
    return cleanDoc;
  });
};

/**
 * Highlight all matched words in text
 * Uses a two-pass replacement to avoid double-highlighting
 */
export const highlightMatches = (text, query) => {
  if (!text || !query) return text;

  const words = normalizeQuery(query)
    .split(' ')
    .filter(word => word.length > 0)
    .sort((a, b) => b.length - a.length); // Sort longest first

  if (words.length === 0) return text;

  let highlighted = text;
  const markers = [];

  // Pass 1: Replace matches with unique markers
  words.forEach((word, wordIndex) => {
    try {
      // Escape word for regex
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedWord})`, 'gi');
      
      highlighted = highlighted.replace(regex, (match) => {
        const marker = `__MATCH_${wordIndex}_${markers.length}__`;
        markers.push({ marker, original: match });
        return marker;
      });
    } catch (e) {
      // Skip invalid regex
    }
  });

  // Pass 2: Replace markers with HTML
  markers.forEach(({ marker, original }) => {
    highlighted = highlighted.replace(
      marker,
      `<mark class="search-highlight">${original}</mark>`
    );
  });

  return highlighted;
};

/**
 * Extract a preview snippet around the first match
 */
export const getMatchPreview = (text, query, contextLength = 60) => {
  if (!text || !query) {
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }

  const words = normalizeQuery(query).split(' ').filter(w => w.length > 0);
  const normalizedText = text.toLowerCase();
  
  // Find index of first matching word
  let firstMatchIndex = -1;
  for (const word of words) {
    const idx = normalizedText.indexOf(word);
    if (idx !== -1 && (firstMatchIndex === -1 || idx < firstMatchIndex)) {
      firstMatchIndex = idx;
    }
  }

  if (firstMatchIndex === -1) {
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }

  const start = Math.max(0, firstMatchIndex - contextLength);
  const end = Math.min(text.length, firstMatchIndex + contextLength + 40);
  
  let snippet = text.substring(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  
  return snippet;
};


