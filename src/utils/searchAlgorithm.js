/**
 * INTELLIGENT ARCHIVAL SEARCH ALGORITHM
 * 
 * enhanced relevance scoring system:
 * 1. Independent word search (multi-term support)
 * 2. Stop-word exclusion
 * 3. Field-weighted matching
 * 4. Field-specific search support
 */

/**
 * Common stop words to exclude from independent word search
 */
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'else', 'when', 
  'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 
  'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 
  'again', 'further', 'then', 'once', 'here', 'there', 'all', 'any', 
  'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
]);

/**
 * Normalize search query for comparison
 */
export const normalizeQuery = (query) => {
  return query.toLowerCase().trim();
};

/**
 * Simple fuzzy matching algorithm
 * Checks if query characters appear in order in the field
 */
const fuzzyMatch = (field, query) => {
  if (query.length < 3) return false; // Fuzzy match only for longer terms
  let queryIdx = 0;
  for (let i = 0; i < field.length && queryIdx < query.length; i++) {
    if (field[i] === query[queryIdx]) {
      queryIdx++;
    }
  }
  return queryIdx === query.length;
};

/**
 * Calculate relevance score for a single field against a single term
 */
const scoreTermAgainstField = (fieldValue, term, fieldWeight = 1) => {
  if (!fieldValue || !term) return 0;
  
  const normalized = normalizeQuery(String(fieldValue));
  const q = normalizeQuery(term);
  
  let score = 0;
  
  // Exact match (highest)
  if (normalized === q) {
    score = 100;
  }
  // Exact word match (high)
  else if (normalized.split(/\s+/).includes(q)) {
    score = 80;
  }
  // Starts with query (medium-high)
  else if (normalized.startsWith(q)) {
    score = 60;
  }
  // Contains query (medium)
  else if (normalized.includes(q)) {
    score = 40;
  }
  // Partial fuzzy match (low)
  else if (fuzzyMatch(normalized, q)) {
    score = 15;
  }
  
  return score * fieldWeight;
};

/**
 * Calculate array field matches
 */
const scoreArrayField = (arrayField, term, fieldWeight = 1) => {
  if (!Array.isArray(arrayField) || arrayField.length === 0) return 0;
  
  const scores = arrayField.map(item => scoreTermAgainstField(item, term, fieldWeight));
  return Math.max(...scores); // Return highest score
};

/**
 * Main search algorithm - scores a single document
 * Now supports multi-word search and field-specific filtering
 */
export const scoreDocument = (document, query, options = {}) => {
  const { searchField = 'all' } = options;
  if (!query || !query.trim()) return 0;
  
  const q = normalizeQuery(query);
  const terms = q.split(/\s+/).filter(term => term.length > 0);
  const importantTerms = terms.filter(term => !STOP_WORDS.has(term) || terms.length === 1);
  
  // Weights for different fields
  const weights = {
    title: 5,
    subjects: 3,
    keywords: 2.5,
    tags: 2,
    description: 1.5,
    author: 1,
    place: 1,
  };

  let totalScore = 0;
  let matchesCount = 0;

  // Function to check if we should score a field based on searchField option
  const shouldScore = (fieldName) => {
    if (searchField === 'all') return true;
    if (searchField === 'title' && fieldName === 'title') return true;
    if (searchField === 'description' && fieldName === 'description') return true;
    return false;
  };

  // Score each important term
  importantTerms.forEach(term => {
    let termScore = 0;
    
    if (shouldScore('title')) {
      termScore += scoreTermAgainstField(document.title, term, weights.title);
    }
    
    if (shouldScore('description')) {
      termScore += scoreTermAgainstField(document.description, term, weights.description);
    }
    
    if (searchField === 'all') {
      termScore += scoreTermAgainstField(document.author, term, weights.author);
      termScore += scoreTermAgainstField(document.place, term, weights.place);
      termScore += scoreArrayField(document.subjects || [], term, weights.subjects);
      termScore += scoreArrayField(document.keywords || [], term, weights.keywords);
      termScore += scoreArrayField(document.tags || [], term, weights.tags);
    }

    if (termScore > 0) {
      totalScore += termScore;
      matchesCount++;
    }
  });

  // Boost if ALL important terms match
  if (matchesCount === importantTerms.length && importantTerms.length > 1) {
    totalScore *= 1.5;
  }

  // Exact whole query boost (if user searched for "India Gulf" and it appears exactly)
  if (importantTerms.length > 1) {
    const fullQueryScore = scoreTermAgainstField(document.title, q, weights.title * 2) + 
                          scoreTermAgainstField(document.description, q, weights.description * 2);
    totalScore += fullQueryScore;
  }

  return Math.round(totalScore);
};

/**
 * Search across entire document collection
 * Returns sorted results with relevance scores
 */
export const searchDocuments = (documents, query, options = {}) => {
  if (!query || !query.trim()) {
    return documents;
  }
  
  // Score all documents
  const scoredResults = documents.map(doc => ({
    ...doc,
    relevanceScore: scoreDocument(doc, query, options),
  }));
  
  // Filter to only documents with matches
  const filtered = scoredResults.filter(doc => doc.relevanceScore > 0);
  
  // Sort by relevance (highest first)
  return filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
};

/**
 * Highlight matched text in results
 */
export const highlightMatches = (text, query) => {
  if (!text || !query) return text;
  
  const q = normalizeQuery(query);
  const terms = q.split(/\s+/).filter(term => term.length > 0 && (!STOP_WORDS.has(term) || q.split(/\s+/).length === 1));
  
  if (terms.length === 0) return text;
  
  let highlightedText = text;
  // Sort terms by length descending to avoid partial matches within highlights
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  
  // Use a temporary placeholder to avoid double highlighting
  sortedTerms.forEach((term, index) => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, `__MARK${index}__$1__ENDMARK__`);
  });

  highlightedText = highlightedText.replace(/__MARK\d+__/g, '<mark class="bg-yellow-200">');
  highlightedText = highlightedText.replace(/__ENDMARK__/g, '</mark>');
  
  return highlightedText;
};

/**
 * Extract preview snippet with context around match
 */
export const getMatchPreview = (text, query, contextLength = 50) => {
  if (!text || !query) return text.substring(0, 150) + (text.length > 150 ? '...' : '');
  
  const normalizedText = normalizeQuery(text);
  const q = normalizeQuery(query);
  const terms = q.split(/\s+/).filter(term => term.length > 0 && !STOP_WORDS.has(term));
  
  // Find the first term that appears in the text
  let matchIndex = -1;
  for (const term of terms) {
    matchIndex = normalizedText.indexOf(term);
    if (matchIndex !== -1) break;
  }
  
  if (matchIndex === -1) {
    return text.substring(0, 150) + (text.length > 150 ? '...' : '');
  }
  
  const start = Math.max(0, matchIndex - contextLength);
  const end = Math.min(text.length, matchIndex + contextLength + (terms[0]?.length || 0));
  
  let preview = text.substring(start, end);
  if (start > 0) preview = '...' + preview;
  if (end < text.length) preview = preview + '...';
  
  return preview;
};

