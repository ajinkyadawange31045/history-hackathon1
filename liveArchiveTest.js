/**
 * LIVE ARCHIVE TEST
 * Tests search with actual archive data to verify field filtering works
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load actual archive data
const archiveData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/archive.json'), 'utf8'));
const documents = archiveData.documents.slice(0, 10); // Test with first 10 docs

console.log(`📚 Testing with ${documents.length} actual archive documents\n`);

// Simplified search algorithm (matching searchAlgorithm.js logic)
const normalizeQuery = (query) => query.toLowerCase().trim();

const scoreTermAgainstField = (fieldValue, term, fieldWeight = 1) => {
  if (!fieldValue || !term) return 0;
  const normalized = normalizeQuery(String(fieldValue));
  const q = normalizeQuery(term);
  
  if (normalized === q) return 100 * fieldWeight;
  if (normalized.split(/\s+/).includes(q)) return 80 * fieldWeight;
  if (normalized.startsWith(q)) return 60 * fieldWeight;
  if (normalized.includes(q)) return 40 * fieldWeight;
  return 0;
};

const scoreDocument = (document, query, searchField = 'all') => {
  if (!query || !query.trim()) return 0;
  
  const terms = normalizeQuery(query).split(/\s+/).filter(t => t);
  const weights = { title: 5, description: 1.5, author: 1, place: 1 };
  
  let totalScore = 0;
  
  for (const term of terms) {
    let score = 0;
    
    if (searchField === 'title') {
      score = scoreTermAgainstField(document.title, term, weights.title);
    } else if (searchField === 'description') {
      score = scoreTermAgainstField(document.description, term, weights.description);
    } else if (searchField === 'all') {
      score += scoreTermAgainstField(document.title, term, weights.title);
      score += scoreTermAgainstField(document.description, term, weights.description);
      score += scoreTermAgainstField(document.author, term, weights.author);
      score += scoreTermAgainstField(document.place, term, weights.place);
    }
    
    totalScore += score;
  }
  
  return totalScore;
};

const search = (docs, query, searchField = 'all') => {
  return docs
    .map(doc => ({ ...doc, score: scoreDocument(doc, query, searchField) }))
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score);
};

// Test cases
console.log('TEST 1: Search "ship" in Title Only');
console.log('-'.repeat(60));
let results = search(documents, 'ship', 'title');
console.log(`Found ${results.length} results:`);
results.slice(0, 3).forEach(doc => console.log(`  ✓ [${doc.id}] ${doc.title} (score: ${doc.score})`));
if (results.length > 0) {
  const allHaveShip = results.every(doc => doc.title.toLowerCase().includes('ship'));
  console.log(`✅ All results have "ship" in title: ${allHaveShip ? 'YES' : 'NO'}\n`);
} else {
  console.log('❌ No results found\n');
}

console.log('TEST 2: Search "ship" in Description Only');
console.log('-'.repeat(60));
results = search(documents, 'ship', 'description');
console.log(`Found ${results.length} results:`);
results.slice(0, 3).forEach(doc => console.log(`  ✓ [${doc.id}] ${doc.title} (score: ${doc.score})`));
if (results.length > 0) {
  const allHaveShip = results.every(doc => (doc.description || '').toLowerCase().includes('ship'));
  console.log(`✅ All results have "ship" in description: ${allHaveShip ? 'YES' : 'NO'}\n`);
} else {
  console.log('❌ No results found\n');
}

console.log('TEST 3: Search "ship" in All Fields');
console.log('-'.repeat(60));
results = search(documents, 'ship', 'all');
console.log(`Found ${results.length} results:`);
results.slice(0, 3).forEach(doc => console.log(`  ✓ [${doc.id}] ${doc.title} (score: ${doc.score})`));
console.log('');

console.log('TEST 4: Title vs All Fields comparison');
console.log('-'.repeat(60));
const titleResults = search(documents, 'ship', 'title');
const allResults = search(documents, 'ship', 'all');
console.log(`Title-only results: ${titleResults.length}`);
console.log(`All-fields results: ${allResults.length}`);
if (allResults.length >= titleResults.length) {
  console.log(`✅ All-fields contains at least as many as title-only: YES\n`);
} else {
  console.log(`❌ ERROR: All-fields has fewer results than title-only\n`);
}

console.log('TEST 5: Verify no unrelated documents in filtered results');
console.log('-'.repeat(60));
const query = 'East';
const titleOnlyResults = search(documents, query, 'title');
console.log(`Searching for "${query}" in title only: ${titleOnlyResults.length} results`);
const hasUnrelated = titleOnlyResults.some(doc => !doc.title.toLowerCase().includes(query.toLowerCase()));
if (hasUnrelated) {
  console.log('❌ FOUND UNRELATED DOCUMENT:');
  titleOnlyResults.forEach(doc => {
    if (!doc.title.toLowerCase().includes(query.toLowerCase())) {
      console.log(`   [${doc.id}] ${doc.title}`);
    }
  });
} else {
  console.log(`✅ All ${titleOnlyResults.length} results contain "${query}" in title\n`);
}

console.log('='.repeat(60));
console.log('✅ Live archive test complete!');
