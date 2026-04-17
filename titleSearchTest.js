/**
 * TITLE-ONLY SEARCH DETAILED TEST
 * Verifies that title search only returns documents with term in title
 */

// Sample documents
const docs = [
  {
    id: 1,
    title: "India Trade Routes",
    description: "Test of trade routes",
    place: "India",
    author: "Test Author"
  },
  {
    id: 2,
    title: "Map of the World",
    description: "A test document about mapping",
    place: "Test Place",
    author: "John Smith"
  },
  {
    id: 3,
    title: "Bengal Region Study",
    description: "From the Test Archives",
    place: "Bengal",
    author: "Test"
  },
  {
    id: 4,
    title: "Test Document Archive",
    description: "Historical records",
    place: "London",
    author: "Various"
  },
  {
    id: 5,
    title: "Chinese Porcelain",
    description: "Beautiful porcelain",
    place: "China",
    author: "Li Wei"
  }
];

// Simple scoring function
function scoreDocumentSimple(doc, query, searchField = 'all') {
  if (!query || !query.trim()) return 0;
  
  const q = query.toLowerCase();
  let score = 0;
  
  if (searchField === 'title') {
    const title = (doc.title || '').toLowerCase();
    if (title.includes(q)) score = 100;
  } else if (searchField === 'description') {
    const desc = (doc.description || '').toLowerCase();
    if (desc.includes(q)) score = 50;
  } else if (searchField === 'all') {
    const title = (doc.title || '').toLowerCase();
    const desc = (doc.description || '').toLowerCase();
    const place = (doc.place || '').toLowerCase();
    const author = (doc.author || '').toLowerCase();
    
    if (title.includes(q)) score += 100;
    if (desc.includes(q)) score += 50;
    if (place.includes(q)) score += 25;
    if (author.includes(q)) score += 25;
  }
  
  return score;
}

function searchSimple(documents, query, searchField = 'all') {
  const scored = documents.map(doc => ({
    ...doc,
    score: scoreDocumentSimple(doc, query, searchField)
  }));
  
  const filtered = scored.filter(doc => doc.score > 0);
  return filtered.sort((a, b) => b.score - a.score);
}

// TESTS
console.log('🧪 TITLE-ONLY SEARCH TEST');
console.log('=====================================\n');

console.log('TEST 1: Search "test" in TITLE only');
console.log('Expected: Only docs 1 and 4 (both have "test" in title)');
const result1 = searchSimple(docs, 'test', 'title');
console.log(`Results: ${result1.length} documents`);
result1.forEach(d => console.log(`  [${d.id}] ${d.title}`));
console.log(`Expected IDs: 1, 4 | Actual IDs: ${result1.map(d => d.id).join(', ')}`);
const pass1 = result1.length === 1 && result1[0].id === 4; // Only "Test Document Archive" has "test" in title
console.log(pass1 ? '✅ PASS\n' : '❌ FAIL\n');

console.log('TEST 2: Search "test" in DESCRIPTION only');
console.log('Expected: Only docs 1, 2, 3 (all have "test" in description)');
const result2 = searchSimple(docs, 'test', 'description');
console.log(`Results: ${result2.length} documents`);
result2.forEach(d => console.log(`  [${d.id}] ${d.title}`));
console.log(`Expected: 1, 2, 3 | Actual: ${result2.map(d => d.id).join(', ')}`);
const pass2 = result2.length === 3 && [1, 2, 3].every(id => result2.some(d => d.id === id));
console.log(pass2 ? '✅ PASS\n' : '❌ FAIL\n');

console.log('TEST 3: Search "test" in ALL fields');
console.log('Expected: Docs 1, 2, 3, 4 (all have "test" somewhere)');
const result3 = searchSimple(docs, 'test', 'all');
console.log(`Results: ${result3.length} documents`);
result3.forEach(d => console.log(`  [${d.id}] ${d.title}`));
console.log(`Expected: 1, 2, 3, 4 | Actual: ${result3.map(d => d.id).join(', ')}`);
const pass3 = result3.length === 4 && [1, 2, 3, 4].every(id => result3.some(d => d.id === id));
console.log(pass3 ? '✅ PASS\n' : '❌ FAIL\n');

console.log('TEST 4: Search "India" in TITLE only');
console.log('Expected: Only doc 1 (has "India" in title)');
const result4 = searchSimple(docs, 'India', 'title');
console.log(`Results: ${result4.length} documents`);
result4.forEach(d => console.log(`  [${d.id}] ${d.title}`));
console.log(`Expected: 1 | Actual: ${result4.map(d => d.id).join(', ')}`);
const pass4 = result4.length === 1 && result4[0].id === 1;
console.log(pass4 ? '✅ PASS\n' : '❌ FAIL\n');

console.log('=====================================');
console.log('Results Summary:');
console.log(`Test 1 (title "test"): ${pass1 ? '✅' : '❌'}`);
console.log(`Test 2 (desc "test"): ${pass2 ? '✅' : '❌'}`);
console.log(`Test 3 (all "test"): ${pass3 ? '✅' : '❌'}`);
console.log(`Test 4 (title "India"): ${pass4 ? '✅' : '❌'}`);
