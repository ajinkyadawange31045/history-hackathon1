/**
 * HIGHLIGHT TEXT UTILITY
 * Highlights search terms in text with precision
 */

/**
 * Escape HTML special characters to prevent XSS
 */
const escapeHtml = (text) => {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
};

/**
 * Highlights multiple search terms in text using a two-pass replacement
 * This approach prevents "highlighting the highlight tags" and double-highlighting
 * 
 * @param {string} text - The text to highlight
 * @param {string} query - Search query (can contain multiple words)
 * @param {object} options - Configuration options
 * @returns {string} - HTML string with highlighted terms
 */
export const highlightText = (text, query, options = {}) => {
  if (!text || !query || typeof text !== 'string') {
    return escapeHtml(text || '');
  }

  const {
    className = 'search-highlight',
    maxHighlights = 100
  } = options;

  // 1. Escape the input text for safety
  let escapedText = escapeHtml(text);

  // 2. Extract and sort search terms (longest first)
  const terms = query.trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(t => t.length > 0)
    .sort((a, b) => b.length - a.length);

  if (terms.length === 0) return escapedText;

  // 3. First Pass: Replace matches with unique placeholders
  // We use a specific pattern: __HL_[termIndex]_[matchIndex]__
  const placeholders = [];
  let placeholderCount = 0;

  terms.forEach((term, termIndex) => {
    try {
      // Escape for regex
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedTerm})`, 'gi');
      
      // Replace matches that aren't already part of a placeholder
      // We look for parts of the string that don't match our placeholder pattern
      escapedText = escapedText.replace(regex, (match) => {
        if (placeholderCount >= maxHighlights) return match;
        
        const id = `__HL_${termIndex}_${placeholderCount}__`;
        placeholders.push({ id, original: match });
        placeholderCount++;
        return id;
      });
    } catch (e) {
      console.error('Highlight regex error:', e);
    }
  });

  // 4. Second Pass: Replace placeholders with final HTML
  let finalHtml = escapedText;
  placeholders.forEach(({ id, original }) => {
    finalHtml = finalHtml.replace(id, `<mark class="${className}">${original}</mark>`);
  });

  return finalHtml;
};

/**
 * Legacy compatibility for multiple terms
 */
export const highlightMultipleTerms = (text, searchTerms, options = {}) => {
  const query = Array.isArray(searchTerms) ? searchTerms.join(' ') : searchTerms;
  return highlightText(text, query, options);
};

/**
 * Extracts search terms from a query string
 */
export const extractSearchTerms = (query) => {
  if (!query || typeof query !== 'string') return [];
  return query.trim().toLowerCase().split(/\s+/).filter(t => t.length > 0);
};

/**
 * React component for rendering highlighted text
 */
export const HighlightedText = ({ text, searchTerm, options = {} }) => {
  if (!text) return null;
  if (!searchTerm) return <span>{text}</span>;

  return (
    <span 
      dangerouslySetInnerHTML={{ __html: highlightText(text, searchTerm, options) }}
      className="highlight-wrapper"
    />
  );
};

export default {
  highlightText,
  highlightMultipleTerms,
  extractSearchTerms,
  HighlightedText
};

