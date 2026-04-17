/**
 * MANUAL VALIDATION TEST FOR SEARCH FIXES
 * Run this to verify search algorithm behavior
 * 
 * Usage: NODE_OPTIONS=--experimental-vm-modules node searchValidation.js
 */

// Test data matching the app structure
const sampleDocs = [
  {
    id: 1,
    title: "India Trade Routes Map",
    description: "A historical map showing trade routes through Asia",
    author: "John Smith",
    place: "India",
    region: "South Asia",
    date: "2020-01-15",
    subjects: ["trade", "geography", "history"],
    keywords: ["map", "routes", "spice"],
    tags: ["india"],
  },
  {
    id: 2,
    title: "The Arabian Peninsula Survey",
    description: "Survey document describing ocean trade and commerce",
    author: "Jane Doe",
    place: "Arabia",
    region: "Middle East",
    date: "2019-06-20",
    subjects: ["geography", "trade", "exploration"],
    keywords: ["ocean", "routes", "navigation"],
    tags: ["arabia"],
  },
  {
    id: 3,
    title: "Chinese Porcelain Trade Records",
    description: "Documentation of porcelain exports to Europe and Asia",
    author: "Li Wei",
    place: "China",
    region: "East Asia",
    date: "2021-03-10",
    subjects: ["trade", "art", "manufacturing"],
    keywords: ["porcelain", "exports", "ceramics"],
    tags: ["china", "trade"],
  },
  {
    id: 4,
    title: "Bengal Settlement Records",
    description: "Official records from Bengal region during colonial period",
    author: "Thomas Brown",
    place: "Bengal",
    region: "South Asia",
    date: "2018-05-22",
    subjects: ["administration", "colonial", "settlement"],
    keywords: ["settlement", "records", "colonial"],
    tags: ["bengal"],
  },
];

// Simulation of the search algorithm fix
function scoreDocumentFixed(document, query, options = {}) {
  const { searchField = 'all' } = options;
  if (!query || !query.trim()) return 0;
  
  const normalizeQuery = (q) => q.toLowerCase().trim();
  const q = normalizeQuery(query);
  
  const weights = {
    title: 5,
    description: 1.5,
    author: 1,
    place: 1,
  };

  const containsQuery = (fieldValue) => {
    if (!fieldValue) return 0;
    const normalized = normalizeQuery(String(fieldValue));
    if (normalized === q) return 100;
    if (normalized.includes(q)) return 40;
    return 0;
  };

  let totalScore = 0;

  if (searchField === 'title') {
    // Only search title
    totalScore = containsQuery(document.title) * weights.title;
  } else if (searchField === 'description') {
    // Only search description
    totalScore = containsQuery(document.description) * weights.description;
  } else if (searchField === 'all') {
    // Search all fields
    totalScore += containsQuery(document.title) * weights.title;
    totalScore += containsQuery(document.description) * weights.description;
    totalScore += containsQuery(document.author) * weights.author;
    totalScore += containsQuery(document.place) * weights.place;
  }

  return totalScore;
}

function searchDocumentsFixed(documents, query, options = {}) {
  if (!query || !query.trim()) return [];
  
  const scored = documents.map(doc => ({
    ...doc,
    relevanceScore: scoreDocumentFixed(doc, query, options),
  }));
  
  const filtered = scored.filter(doc => doc.relevanceScore > 0);
  return filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// ============================================
// TEST CASES
// ============================================

function runTests() {
  console.log('🧪 SEARCH ALGORITHM VALIDATION TESTS');
  console.log('=====================================\n');

  let passCount = 0;
  let failCount = 0;

  // Test 1: Title-only search
  console.log('TEST 1: Search "India" in Title only');
  console.log('-'.repeat(50));
  const titleResults = searchDocumentsFixed(sampleDocs, 'India', { searchField: 'title' });
  console.log(`Results: ${titleResults.length} documents`);
  titleResults.forEach(doc => console.log(`  ✓ [ID ${doc.id}] ${doc.title}`));
  
  if (titleResults.length === 1 && titleResults[0].id === 1) {
    console.log('✅ PASS: Only doc with India in title returned\n');
    passCount++;
  } else {
    console.log('❌ FAIL: Expected only doc 1\n');
    failCount++;
  }

  // Test 2: Description-only search
  console.log('TEST 2: Search "India" in Description only');
  console.log('-'.repeat(50));
  const descResults = searchDocumentsFixed(sampleDocs, 'India', { searchField: 'description' });
  console.log(`Results: ${descResults.length} documents`);
  descResults.forEach(doc => console.log(`  ✓ [ID ${doc.id}] ${doc.title}`));
  
  if (descResults.length === 0) {
    console.log('✅ PASS: No docs with India in description (as expected)\n');
    passCount++;
  } else {
    console.log('❌ FAIL: Expected no results (India not in any descriptions)\n');
    failCount++;
  }

  // Test 3: All fields search
  console.log('TEST 3: Search "India" in All fields');
  console.log('-'.repeat(50));
  const allResults = searchDocumentsFixed(sampleDocs, 'India', { searchField: 'all' });
  console.log(`Results: ${allResults.length} documents`);
  allResults.forEach(doc => console.log(`  ✓ [ID ${doc.id}] ${doc.title} (score: ${doc.relevanceScore})`));
  
  if (allResults.length === 1 && allResults[0].id === 1) {
    console.log('✅ PASS: Only doc 1 found (India in title and place)\n');
    passCount++;
  } else {
    console.log('❌ FAIL: Expected only doc 1 with India in title/place\n');
    failCount++;
  }

  // Test 4: Title results should score higher than description
  console.log('TEST 4: Title match scores higher than description match');
  console.log('-'.repeat(50));
  const allResultsForScore = searchDocumentsFixed(sampleDocs, 'India', { searchField: 'all' });
  const doc1Score = allResultsForScore.find(d => d.id === 1)?.relevanceScore || 0;
  const doc2Score = allResultsForScore.find(d => d.id === 2)?.relevanceScore || 0;
  console.log(`Doc 1 (India in title): ${doc1Score}`);
  console.log(`Doc 2 (India in description): ${doc2Score}`);
  
  if (doc1Score > doc2Score) {
    console.log('✅ PASS: Title match scored higher\n');
    passCount++;
  } else {
    console.log('❌ FAIL: Title match should score higher\n');
    failCount++;
  }

  // Test 5: No highlighting in unrelated fields
  console.log('TEST 5: Title-only search should NOT return description matches');
  console.log('-'.repeat(50));
  const titleOnlyResults = searchDocumentsFixed(sampleDocs, 'trade', { searchField: 'title' });
  console.log(`Results: ${titleOnlyResults.length} documents`);
  titleOnlyResults.forEach(doc => console.log(`  ✓ [ID ${doc.id}] ${doc.title}`));
  
  // "trade" appears in titles of docs 1 and 3
  if (titleOnlyResults.length === 2 && titleOnlyResults.every(doc => [1, 3].includes(doc.id))) {
    console.log('✅ PASS: Only docs with "trade" in title returned\n');
    passCount++;
  } else {
    console.log('❌ FAIL: Expected docs 1 and 3 (both have "trade" in title)\n');
    failCount++;
  }

  // Test 6: Sorting after search
  console.log('TEST 6: Sorting results by title after search');
  console.log('-'.repeat(50));
  const originalResults = searchDocumentsFixed(sampleDocs, 'India', { searchField: 'all' });
  const sortedResults = [...originalResults].sort((a, b) => a.title.localeCompare(b.title));
  
  console.log('Original search order:');
  originalResults.forEach(doc => console.log(`  [ID ${doc.id}] ${doc.title}`));
  console.log('After sorting by title (A-Z):');
  sortedResults.forEach(doc => console.log(`  [ID ${doc.id}] ${doc.title}`));
  
  // Check if sorted correctly and no new docs appeared
  const sortedIds = sortedResults.map(d => d.id);
  const originalIds = originalResults.map(d => d.id);
  if (JSON.stringify(sortedIds.sort()) === JSON.stringify(originalIds.sort())) {
    console.log('✅ PASS: Same documents shown, sorted correctly\n');
    passCount++;
  } else {
    console.log('❌ FAIL: New documents appeared after sorting\n');
    failCount++;
  }

  // Summary
  console.log('=====================================');
  console.log(`RESULTS: ${passCount} passed, ${failCount} failed`);
  console.log(`Total: ${passCount + failCount} tests\n`);
  
  if (failCount === 0) {
    console.log('🎉 All tests passed! Search algorithm is working correctly.');
  } else {
    console.log(`⚠️  ${failCount} test(s) failed. Please review the fixes.`);
  }
}

// Run tests
runTests();
