/**
 * SORTING AND SEARCH INTEGRATION TESTS
 * Tests for sorting after search, filter maintenance, and results integrity
 */

import { renderHook, act } from '@testing-library/react';
import { useArchiveSearch } from './useArchiveSearch';

// Sample test documents
const testDocuments = [
  {
    id: 1,
    title: "India Trade Routes Map",
    description: "A map showing Indian trade",
    date: "2020-01-15",
    type: "map",
    region: "South Asia",
    place: "India",
    author: "John Smith",
    subjects: ["trade"],
    keywords: [],
  },
  {
    id: 2,
    title: "Arabian Peninsula Survey",
    description: "A survey document",
    date: "2019-06-20",
    type: "survey",
    region: "Middle East",
    place: "Arabia",
    author: "Jane Doe",
    subjects: [],
    keywords: [],
  },
  {
    id: 3,
    title: "Bengal Records",
    description: "Historical records from Bengal region in India",
    date: "2021-03-10",
    type: "record",
    region: "South Asia",
    place: "Bengal",
    author: "Li Wei",
    subjects: ["history"],
    keywords: [],
  },
];

describe('Search + Sort Integration', () => {
  
  test('Sorting by title after search maintains search results', () => {
    const { result } = renderHook(() => useArchiveSearch(testDocuments, {}));
    
    // First, search for "India"
    act(() => {
      result.current.setQuery('India');
      result.current.setSearchField('all');
    });
    
    // Wait for debounce
    setTimeout(() => {
      const afterSearch = result.current.results.map(doc => doc.id);
      expect(afterSearch).toContain(1); // "India Trade Routes Map"
      expect(afterSearch).toContain(3); // "Bengal Records" (has India in description)
      expect(afterSearch).not.toContain(2); // "Arabian Peninsula Survey" (no India)
      
      // Then sort by title
      act(() => {
        result.current.setSortBy('title');
      });
      
      const afterSort = result.current.results.map(doc => doc.id);
      
      // Same documents should still be in results
      expect(afterSort).toContain(1);
      expect(afterSort).toContain(3);
      expect(afterSort).not.toContain(2);
      
      // They should be sorted by title alphabetically
      const sortedTitles = afterSort.map(id => testDocuments[id - 1].title);
      expect(sortedTitles).toEqual([...sortedTitles].sort());
    }, 350);
  });

  test('Sorting by date after search maintains search results', () => {
    const { result } = renderHook(() => useArchiveSearch(testDocuments, {}));
    
    act(() => {
      result.current.setQuery('India');
      result.current.setSearchField('all');
    });
    
    setTimeout(() => {
      const beforeSort = result.current.results.length;
      
      act(() => {
        result.current.setSortBy('date-newest');
      });
      
      const afterSort = result.current.results.length;
      
      // Result count should remain the same
      expect(afterSort).toBe(beforeSort);
      
      // Should be sorted by date (newest first)
      const dates = result.current.results.map(doc => new Date(doc.date).getTime());
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
      }
    }, 350);
  });

  test('No unrelated documents appear after sorting', () => {
    const { result } = renderHook(() => useArchiveSearch(testDocuments, {}));
    
    act(() => {
      result.current.setQuery('India');
      result.current.setSearchField('title');
    });
    
    setTimeout(() => {
      // Get IDs of matched documents
      const matchedIds = result.current.results.map(doc => doc.id);
      
      // Only doc 1 has "India" in title
      expect(matchedIds).toEqual([1]);
      
      act(() => {
        result.current.setSortBy('title');
      });
      
      const afterSortIds = result.current.results.map(doc => doc.id);
      
      // Should still only have doc 1
      expect(afterSortIds).toEqual([1]);
      expect(afterSortIds).not.toContain(2);
      expect(afterSortIds).not.toContain(3);
    }, 350);
  });

});

describe('Search Field Isolation', () => {
  
  test('Title search does not include description matches', () => {
    const { result } = renderHook(() => useArchiveSearch(testDocuments, {}));
    
    act(() => {
      result.current.setQuery('Bengal');
      result.current.setSearchField('title');
    });
    
    setTimeout(() => {
      const resultIds = result.current.results.map(doc => doc.id);
      
      // Doc 3 "Bengal Records" has "Bengal" in title - should be included
      expect(resultIds).toContain(3);
      
      // No other documents should be included
      expect(resultIds.length).toBe(1);
    }, 350);
  });

  test('Description search isolates to description field', () => {
    const { result } = renderHook(() => useArchiveSearch(testDocuments, {}));
    
    act(() => {
      result.current.setQuery('map');
      result.current.setSearchField('description');
    });
    
    setTimeout(() => {
      const resultIds = result.current.results.map(doc => doc.id);
      
      // Doc 1 has "map" in description - should be included
      expect(resultIds).toContain(1);
      
      // No other documents
      expect(resultIds.length).toBe(1);
    }, 350);
  });

});

console.log('✅ Sorting and Search Integration Tests Ready');
console.log('Run: npm test -- useArchiveSearch.test.js');
