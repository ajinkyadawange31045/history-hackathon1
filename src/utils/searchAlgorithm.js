/**
 * INTELLIGENT ARCHIVAL SEARCH ALGORITHM
 * 
 * Three-tier relevance scoring system:
 * 1. Exact match detection (highest weight)
 * 2. Field-weighted partial matching
 * 3. Term frequency boost
 */

/**
 * Normalize search query for comparison
 */
export const normalizeQuery = (query) => {
  return query.toLowerCase().trim();
};

/**
 * Calculate relevance score for a single field
 * Supports partial matching with fuzzy scoring
 */
const scoreField = (fieldValue, query, fieldWeight = 1) => {
  if (!fieldValue) return 0;
  
  const normalized = normalizeQuery(String(fieldValue));
  const normalizedQuery = normalizeQuery(query);
  
  if (!normalizedQuery) return 0;
  
  let score = 0;
  
  // Exact match (highest)
  if (normalized === normalizedQuery) {
    score = 100 * fieldWeight;
  }
  // Starts with query (high)
  else if (normalized.startsWith(normalizedQuery)) {
    score = 75 * fieldWeight;
  }
  // Exact word match (medium-high)
  else if (normalized.split(/\s+/).includes(normalizedQuery)) {
    score = 60 * fieldWeight;
  }
  // Contains query (medium)
  else if (normalized.includes(normalizedQuery)) {
    score = 40 * fieldWeight;
  }
  // Partial fuzzy match (low)
  else if (fuzzyMatch(normalized, normalizedQuery)) {
    score = 20 * fieldWeight;
  }
  
  return score;
};

/**
 * Simple fuzzy matching algorithm
 * Checks if query characters appear in order in the field
 */
const fuzzyMatch = (field, query) => {
  let queryIdx = 0;
  for (let i = 0; i < field.length && queryIdx < query.length; i++) {
    if (field[i] === query[queryIdx]) {
      queryIdx++;
    }
  }
  return queryIdx === query.length;
};

/**
 * Calculate array field matches (for subjects, tags, keywords)
 */
const scoreArrayField = (arrayField, query, fieldWeight = 1) => {
  if (!Array.isArray(arrayField) || arrayField.length === 0) return 0;
  
  const scores = arrayField.map(item => scoreField(item, query, fieldWeight));
  return Math.max(...scores); // Return highest score
};

/**
 * Main search algorithm - scores a single document
 */
export const scoreDocument = (document, query) => {
  if (!query || !query.trim()) return 0;
  
  const q = normalizeQuery(query);
  let totalScore = 0;
  
  // Field weights (importance for relevance)
  const weights = {
    title: 4,        // Highest priority
    subjects: 2.5,
    keywords: 2,
    tags: 1.5,
    description: 1,
    author: 0.8,
    place: 0.8,
  };
  
  // Score primary text fields
  totalScore += scoreField(document.title, q, weights.title);
  totalScore += scoreField(document.description, q, weights.description);
  totalScore += scoreField(document.author, q, weights.author);
  totalScore += scoreField(document.place, q, weights.place);
  
  // Score array fields
  totalScore += scoreArrayField(document.subjects || [], q, weights.subjects);
  totalScore += scoreArrayField(document.keywords || [], q, weights.keywords);
  totalScore += scoreArrayField(document.tags || [], q, weights.tags);
  
  // Term frequency boost (if query appears multiple times)
  const titleMatches = (normalizeQuery(document.title)).match(new RegExp(q, 'g')) || [];
  const descMatches = (normalizeQuery(document.description)).match(new RegExp(q, 'g')) || [];
  const frequencyBoost = (titleMatches.length * 10) + (descMatches.length * 5);
  totalScore += frequencyBoost;
  
  return Math.round(totalScore);
};

/**
 * Search across entire document collection
 * Returns sorted results with relevance scores
 */
export const searchDocuments = (documents, query) => {
  if (!query || !query.trim()) {
    return documents;
  }
  
  // Score all documents
  const scoredResults = documents.map(doc => ({
    ...doc,
    relevanceScore: scoreDocument(doc, query),
  }));
  
  // Filter to only documents with matches
  const filtered = scoredResults.filter(doc => doc.relevanceScore > 0);
  
  // Sort by relevance (highest first)
  return filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
};

/**
 * Highlight matched text in results
 * Returns HTML string with <mark> tags
 */
export const highlightMatches = (text, query) => {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
};

/**
 * Extract preview snippet with context around match
 */
export const getMatchPreview = (text, query, contextLength = 50) => {
  if (!text || !query) return text.substring(0, 150) + '...';
  
  const normalizedText = normalizeQuery(text);
  const normalizedQuery = normalizeQuery(query);
  const matchIndex = normalizedText.indexOf(normalizedQuery);
  
  if (matchIndex === -1) {
    return text.substring(0, 150) + '...';
  }
  
  const start = Math.max(0, matchIndex - contextLength);
  const end = Math.min(text.length, matchIndex + normalizedQuery.length + contextLength);
  
  let preview = text.substring(start, end);
  if (start > 0) preview = '...' + preview;
  if (end < text.length) preview = preview + '...';
  
  return preview;
};
