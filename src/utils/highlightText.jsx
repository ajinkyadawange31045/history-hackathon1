/**
 * HIGHLIGHT TEXT UTILITY
 * Highlights search terms in text, similar to Google search results
 */

/**
 * Escape HTML special characters to prevent XSS
 */
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Highlights search terms in text with yellow background
 * @param {string} text - The text to highlight
 * @param {string} searchTerm - The search term to highlight
 * @param {object} options - Configuration options
 * @returns {string} - HTML string with highlighted terms
 */
export const highlightText = (text, searchTerm, options = {}) => {
  if (!text || !searchTerm || typeof text !== 'string') {
    return escapeHtml(text || '');
  }

  const {
    className = 'search-highlight',
    caseSensitive = false,
    wholeWord = false,
    maxHighlights = 50 // Prevent performance issues with very long texts
  } = options;

  // Escape the text first to prevent XSS
  const escapedText = escapeHtml(text);
  
  // Handle multiple search terms by splitting on spaces
  const searchTerms = searchTerm.trim().split(/\s+/).filter(term => term.length > 0);
  
  let highlightedText = escapedText;
  
  // Apply highlighting for each search term
  searchTerms.forEach(term => {
    if (!term) return;
    
    // Create regex pattern for highlighting
    let pattern;
    try {
      // Escape special regex characters in the search term
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Build the pattern
      let patternString = escapedTerm;
      if (wholeWord) {
        patternString = `\\b${patternString}\\b`;
      }
      
      pattern = new RegExp(patternString, caseSensitive ? 'g' : 'gi');
    } catch (error) {
      // If regex fails, skip this term
      return;
    }

    // Split text and highlight matches
    const parts = [];
    let lastIndex = 0;
    let match;
    let highlightCount = 0;

    while ((match = pattern.exec(highlightedText)) !== null && highlightCount < maxHighlights) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(highlightedText.substring(lastIndex, match.index));
      }
      
      // Add highlighted match
      parts.push(`<mark class="${className}">${match[0]}</mark>`);
      
      lastIndex = pattern.lastIndex;
      highlightCount++;
    }

    // Add remaining text
    if (lastIndex < highlightedText.length) {
      parts.push(highlightedText.substring(lastIndex));
    }

    highlightedText = parts.length > 1 ? parts.join('') : highlightedText;
  });

  return highlightedText;
};

/**
 * Highlights multiple search terms in text
 * @param {string} text - The text to highlight
 * @param {string[]} searchTerms - Array of search terms to highlight
 * @param {object} options - Configuration options
 * @returns {string} - HTML string with highlighted terms
 */
export const highlightMultipleTerms = (text, searchTerms, options = {}) => {
  if (!text || !searchTerms?.length || typeof text !== 'string') {
    return escapeHtml(text || '');
  }

  let highlightedText = escapeHtml(text);
  
  // Apply highlighting for each term
  searchTerms.forEach(term => {
    if (term && term.trim()) {
      highlightedText = highlightText(highlightedText, term.trim(), {
        ...options,
        // Prevent double-highlighting by using a different approach
        className: options.className || 'search-highlight'
      });
    }
  });

  return highlightedText;
};

/**
 * Extracts search terms from a query string
 * @param {string} query - Search query
 * @returns {string[]} - Array of unique search terms
 */
export const extractSearchTerms = (query) => {
  if (!query || typeof query !== 'string') {
    return [];
  }

  // Split by spaces and quotes, remove empty strings and duplicates
  const terms = query
    .match(/"[^"]+"|\S+/g) || [] // Match quoted phrases and individual words
    .map(term => term.replace(/"/g, '').trim())
    .filter(term => term.length > 0)
    .filter((term, index, arr) => arr.indexOf(term) === index); // Remove duplicates

  return terms;
};

/**
 * React component for rendering highlighted text
 */
export const HighlightedText = ({ text, searchTerm, options = {} }) => {
  if (!text || !searchTerm) {
    return <span>{text || ''}</span>;
  }

  const highlightedHTML = highlightText(text, searchTerm, options);
  
  return (
    <span 
      dangerouslySetInnerHTML={{ __html: highlightedHTML }}
      style={{ 
        wordBreak: 'break-word',
        ...options.style
      }}
    />
  );
};

export default {
  highlightText,
  highlightMultipleTerms,
  extractSearchTerms,
  HighlightedText
};
