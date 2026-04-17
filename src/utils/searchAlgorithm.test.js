/**
 * SEARCH ALGORITHM TESTS
 * Tests for simplified multi-word search
 */

import { searchDocuments, normalizeQuery, highlightMatches, getMatchPreview } from './searchAlgorithm';

// Sample test documents
const testDocuments = [
  {
    id: 1,
    title: "India Trade Routes Map",
    description: "A historical map showing trade routes through India and Gulf ports",
    author: "John Smith",
    place: "India",
    region: "South Asia",
    date: "2020-01-15",
    subjects: ["trade", "geography"],
    keywords: ["map", "routes"],
    tags: ["india", "gulf"],
  },
  {
    id: 2,
    title: "The Arabian Peninsula Survey",
    description: "Survey document describing Indian Ocean trade with India",
    author: "Jane Doe",
    place: "Arabia",
    region: "Middle East",
    date: "2019-06-20",
    subjects: ["geography", "trade"],
    keywords: ["ocean", "routes"],
    tags: ["arabia", "india"],
  },
  {
    id: 3,
    title: "Chinese Porcelain Records",
    description: "Documentation of porcelain exports, not related to India",
    author: "Li Wei",
    place: "China",
    region: "East Asia",
    date: "2021-03-10",
    subjects: ["trade", "art"],
    keywords: ["porcelain", "exports"],
    tags: ["china"],
  },
];

describe('Simplified Search Algorithm - Single Word Search', () => {
  
  test('Search for single word returns all matching documents', () => {
    const results = searchDocuments(testDocuments, 'India');
    
    // All documents containing 'India' should be returned
    expect(results.length).toBeGreaterThan(0);
    expect(results.map(doc => doc.id)).toContain(1);
    expect(results.map(doc => doc.id)).toContain(2);
    expect(results.map(doc => doc.id)).not.toContain(3);
  });

  test('Case-insensitive search finds results', () => {
    const results = searchDocuments(testDocuments, 'INDIA');
    expect(results.length).toBeGreaterThan(0);
    expect(results.map(doc => doc.id)).toContain(1);
  });

  test('Search for nonexistent word returns empty results', () => {
    const results = searchDocuments(testDocuments, 'Nonexistent');
    expect(results.length).toBe(0);
  });

});

describe('Simplified Search Algorithm - Multi-Word Search', () => {
  
  test('Search for multiple words returns documents containing ALL words (AND logic)', () => {
    const results = searchDocuments(testDocuments, 'India Gulf');
    
    // Only doc 1 has both India AND Gulf
    expect(results.length).toBeGreaterThan(0);
    const ids = results.map(doc => doc.id);
    expect(ids).toContain(1); // Has both India and Gulf
    // Doc 2 has India but not Gulf
    expect(ids).not.toContain(2);
  });

  test('Multi-word search with all documents', () => {
    const results = searchDocuments(testDocuments, 'India trade');
    
    // docs 1 and 2 have both India and trade
    const ids = results.map(doc => doc.id);
    expect(ids.length).toBeGreaterThanOrEqual(2);
    expect(ids).toContain(1);
    expect(ids).toContain(2);
  });

  test('Multi-word search with nonexistent word returns no results', () => {
    const results = searchDocuments(testDocuments, 'India xyz');
    expect(results.length).toBe(0);
  });

});

describe('Simplified Search Algorithm - Edge Cases', () => {
  
  test('Empty query returns all documents (falls back to original list)', () => {
    const results = searchDocuments(testDocuments, '');
    expect(results.length).toBe(testDocuments.length);
  });

  test('Whitespace-only query returns all documents', () => {
    const results = searchDocuments(testDocuments, '   ');
    expect(results.length).toBe(testDocuments.length);
  });

  test('Extra whitespace between words is handled', () => {
    const results = searchDocuments(testDocuments, '  India   Gulf  ');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe(1);
  });

});

describe('Highlight Matches', () => {

  test('Highlight single word in text', () => {
    const text = 'India is a country in Asia';
    const highlighted = highlightMatches(text, 'India');
    expect(highlighted).toContain('<mark class="bg-yellow-200">India</mark>');
  });

  test('Highlight multiple different words', () => {
    const text = 'India and Gulf trade routes';
    const highlighted = highlightMatches(text, 'India Gulf');
    expect(highlighted).toContain('<mark class="bg-yellow-200">India</mark>');
    expect(highlighted).toContain('<mark class="bg-yellow-200">Gulf</mark>');
  });

  test('Highlight is case-insensitive', () => {
    const text = 'India is called Bharat in Hindi';
    const highlighted = highlightMatches(text, 'india');
    expect(highlighted).toContain('<mark class="bg-yellow-200">India</mark>');
  });

  test('No highlight when word not found', () => {
    const text = 'Some text here';
    const highlighted = highlightMatches(text, 'India');
    expect(highlighted).not.toContain('<mark');
  });

});

describe('Match Preview', () => {

  test('Get preview of matching text', () => {
    const text = 'This is a long text about India and its trade routes which were very important';
    const preview = getMatchPreview(text, 'India');
    expect(preview).toContain('India');
  });

  test('Preview includes ellipsis when truncated', () => {
    const text = 'Start of text here. The word India appears later in the document and continues with more text.';
    const preview = getMatchPreview(text, 'India');
    expect(preview.includes('...')).toBe(true);
  });

  test('Preview without match returns beginning of text', () => {
    const text = 'This is the beginning of a very long document that contains important information';
    const preview = getMatchPreview(text, 'xyz');
    expect(preview).toContain('This is the beginning');
  });

});

// Log test results summary
console.log('✅ Search Algorithm Tests Ready');
console.log('Run: npm test -- searchAlgorithm.test.js');
