
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

/**
 * REFINED MULTI-WORD SEARCH ALGORITHM (PASSED FROM src/utils/searchAlgorithm.js)
 */
const normalizeQuery = (query) => {
  if (!query) return '';
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
};

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

const searchDocuments = (documents, query, options = {}) => {
  const { 
    strict = false, 
    searchField = 'all' 
  } = options;

  if (!query || !query.trim()) {
    return documents;
  }

  const words = normalizeQuery(query).split(' ').filter(w => w.length > 0);
  if (words.length === 0) return documents;

  const scoredDocuments = documents.map(doc => {
    let searchText = '';
    if (searchField === 'all') {
      searchText = getDocumentSearchText(doc);
    } else {
      const val = doc[searchField];
      if (Array.isArray(val)) {
        searchText = val.join(' ').toLowerCase();
      } else {
        searchText = String(val || '').toLowerCase();
      }
    }

    let matchCount = 0;
    words.forEach(word => {
      if (searchText.includes(word)) matchCount++;
    });

    return {
      ...doc,
      _searchScore: matchCount,
      _allWordsMatched: matchCount === words.length
    };
  });

  let results = scoredDocuments.filter(doc => {
    if (strict) {
      return doc._allWordsMatched;
    }
    return doc._searchScore > 0;
  });

  results.sort((a, b) => b._searchScore - a._searchScore);

  return results;
};

// TEST
console.log('Testing "india gulf"...');
const results = searchDocuments(sampleDocs, 'india gulf');
console.log(`Found ${results.length} results.`);
results.forEach(r => console.log(`- ID ${r.id}: ${r.title} (Score: ${r._searchScore})`));

process.exit(0);
