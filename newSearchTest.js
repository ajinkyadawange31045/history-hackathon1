/**
 * SIMPLIFIED SEARCH ALGORITHM - QUICK TEST
 * This file demonstrates and tests the new simplified search implementation
 * 
 * Usage: npx node --input-type=module --eval "$(cat newSearchTest.js)"
 * Or add to package.json as test-search script
 */

// ============================================
// SAMPLE TEST DATA
// ============================================

const sampleDocs = [
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
    description: "Survey document describing Indian Ocean trade routes and navigation",
    author: "Jane Doe",
    place: "Arabia",
    region: "Middle East",
    date: "2019-06-20",
    subjects: ["geography", "trade"],
    keywords: ["ocean", "routes", "navigation"],
    tags: ["arabia"],
  },
  {
    id: 3,
    title: "Chinese Porcelain Records",
    description: "Documentation of porcelain exports to Europe and Asia",
    author: "Li Wei",
    place: "China",
    region: "East Asia",
    date: "2021-03-10",
    subjects: ["trade", "art"],
    keywords: ["porcelain", "exports"],
    tags: ["china", "trade"],
  },
  {
    id: 4,
    title: "Bengal Settlement Records",
    description: "Official records from Bengal region showing trade and commerce with Gulf states",
    author: "Thomas Brown",
    place: "Bengal",
    region: "India",
    date: "1995-03-20",
    subjects: ["governance", "trade"],
    keywords: ["settlement", "administration", "commerce"],
    tags: ["bengal", "india", "gulf"],
  },
];

// ============================================
// NEW SIMPLIFIED SEARCH ALGORITHM
// ============================================

const normalizeQuery = (query) => {
  return query.toLowerCase().trim();
};

const findWordInField = (fieldValue, word) => {
  if (!fieldValue) return false;
  const normalized = normalizeQuery(String(fieldValue));
  const normalizedWord = normalizeQuery(word);
  return normalized.includes(normalizedWord);
};

const wordFoundInDocument = (document, word) => {
  const fieldsToSearch = [
    document.title,
    document.description,
    document.author,
    document.place,
    document.region,
    document.type,
    document.format,
    document.collection,
    document.language,
    document.holdingInstitution,
  ];

  if (fieldsToSearch.some(field => findWordInField(field, word))) {
    return true;
  }

  const arrayFields = [
    ...(document.subjects || []),
    ...(document.keywords || []),
    ...(document.tags || []),
  ];

  return arrayFields.some(item => findWordInField(item, word));
};

const searchDocuments = (documents, query, options = {}) => {
  if (!query || !query.trim()) {
    return documents;
  }

  const words = normalizeQuery(query)
    .split(/\s+/)
    .filter(word => word.length > 0);

  if (words.length === 0) {
    return documents;
  }

  const results = documents.filter(doc => {
    return words.every(word => wordFoundInDocument(doc, word));
  });

  return results;
};

// ============================================
// TEST SUITE
// ============================================

function runTests() {
  console.log('🔍 SIMPLIFIED SEARCH ALGORITHM - TEST SUITE');
  console.log('='.repeat(60));
  console.log('');

  let passCount = 0;
  let failCount = 0;

  function test(name, condition) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passCount++;
    } else {
      console.log(`❌ FAIL: ${name}`);
      failCount++;
    }
  }

  // Test 1: Single word search
  console.log('\n📋 TEST GROUP 1: Single Word Search');
  console.log('-'.repeat(60));
  
  let results = searchDocuments(sampleDocs, 'India');
  console.log(`Search: "India"`);
  console.log(`  Results: ${results.length} documents (IDs: ${results.map(d => d.id).join(', ')})`);
  test('Single word "India" finds multiple documents', results.length === 3);
  test('Did NOT find document 3 (China)', !results.some(d => d.id === 3));

  // Test 2: Multi-word search - AND logic
  console.log('\n📋 TEST GROUP 2: Multi-Word Search (AND Logic)');
  console.log('-'.repeat(60));

  results = searchDocuments(sampleDocs, 'India Gulf');
  console.log(`Search: "India Gulf"`);
  console.log(`  Results: ${results.length} documents (IDs: ${results.map(d => d.id).join(', ')})`);
  test('Multi-word "India Gulf" finds documents with BOTH words', results.length === 2);
  test('Found document 1 (has both in description)', results.some(d => d.id === 1));
  test('Found document 4 (has both in description)', results.some(d => d.id === 4));
  test('Did NOT find document 2 (only has India through tags/description)', results.length === 2);

  // Test 3: Case-insensitive search
  console.log('\n📋 TEST GROUP 3: Case Insensitivity');
  console.log('-'.repeat(60));

  const result1 = searchDocuments(sampleDocs, 'india');
  const result2 = searchDocuments(sampleDocs, 'INDIA');
  const result3 = searchDocuments(sampleDocs, 'India');
  console.log(`Search: "india" vs "INDIA" vs "India"`);
  test('Case-insensitive: lowercase "india"', result1.length > 0);
  test('Case-insensitive: uppercase "INDIA"', result2.length > 0);
  test('Case-insensitive: all return same results', 
    result1.length === result2.length && result2.length === result3.length);

  // Test 4: Three-word search (more restrictive)
  console.log('\n📋 TEST GROUP 4: Three-Word Search');
  console.log('-'.repeat(60));

  results = searchDocuments(sampleDocs, 'India trade routes');
  console.log(`Search: "India trade routes"`);
  console.log(`  Results: ${results.length} documents (IDs: ${results.map(d => d.id).join(', ')})`);
  test('Three-word search is more restrictive', results.length <= 2);

  // Test 5: Search with no matches
  console.log('\n📋 TEST GROUP 5: No Matches');
  console.log('-'.repeat(60));

  results = searchDocuments(sampleDocs, 'xyz123');
  console.log(`Search: "xyz123"`);
  test('Nonexistent word returns 0 results', results.length === 0);

  // Test 6: Empty query
  console.log('\n📋 TEST GROUP 6: Edge Cases');
  console.log('-'.repeat(60));

  results = searchDocuments(sampleDocs, '');
  console.log(`Search: "" (empty)`);
  test('Empty query returns all documents', results.length === sampleDocs.length);

  results = searchDocuments(sampleDocs, '   ');
  console.log(`Search: "   " (whitespace only)`);
  test('Whitespace-only query returns all documents', results.length === sampleDocs.length);

  // Test 7: Partial word matching (substring)
  console.log('\n📋 TEST GROUP 7: Substring Matching');
  console.log('-'.repeat(60));

  results = searchDocuments(sampleDocs, 'port');
  console.log(`Search: "port"`);
  console.log(`  Results: ${results.length} documents (IDs: ${results.map(d => d.id).join(', ')})`);
  test('Substring "port" finds "ports", "porcelain", etc.', results.length > 0);

  // Test 8: Search across different fields
  console.log('\n📋 TEST GROUP 8: Field Coverage');
  console.log('-'.repeat(60));

  results = searchDocuments(sampleDocs, 'gallery');
  console.log(`Search: "gallery" (should NOT find anything)`);
  test('Searches all fields but finds no matches', results.length === 0);

  results = searchDocuments(sampleDocs, 'Brown');
  console.log(`Search: "Brown" (in author field)`);
  console.log(`  Results: ${results.length} documents (IDs: ${results.map(d => d.id).join(', ')})`);
  test('Finds match in author field', results.some(d => d.id === 4));

  // ============================================
  // TEST SUMMARY
  // ============================================

  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`Total: ${passCount + failCount}`);
  console.log('');

  if (failCount === 0) {
    console.log('🎉 ALL TESTS PASSED! The simplified search algorithm is working correctly.');
  } else {
    console.log(`⚠️  ${failCount} test(s) failed. Please review the implementation.`);
  }
}

// ============================================
// RUN TESTS
// ============================================

runTests();
