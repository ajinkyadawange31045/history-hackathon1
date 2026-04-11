import { useState, useCallback, useMemo, useEffect } from 'react';
import { searchDocuments } from '../utils/searchAlgorithm';
import { applyFilters, getDefaultFilters } from '../utils/filterLogic';

/**
 * Hook for managing archival search state
 * Combines search query + filters
 */
export const useArchiveSearch = (documents, metadata) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(getDefaultFilters());
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance' or 'date'
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Debounce search query (300ms delay for performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  // Memoized search + filter pipeline
  const results = useMemo(() => {
    if (!documents || documents.length === 0) return [];
    
    // Step 1: Search (only if there's a query)
    let searchableDocuments = debouncedQuery
      ? searchDocuments(documents, debouncedQuery)
      : documents;
    
    // Step 2: Apply filters (only to the searched results when search is active)
    // When search is active, filters apply to searched results only
    // When no search, filters apply to all documents
    const filtered = applyFilters(searchableDocuments, filters);
    
    // Step 3: Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    // 'relevance' sort already applied by searchDocuments
    
    return filtered;
  }, [debouncedQuery, filters, sortBy, documents]);
  
  // Toggle filter option
  const toggleFilter = useCallback((category, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      const array = newFilters[category];
      
      const index = array.indexOf(value);
      if (index > -1) {
        array.splice(index, 1);
      } else {
        array.push(value);
      }
      
      return newFilters;
    });
  }, []);
  
  // Update date range
  const setDateRange = useCallback((start, end) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end },
    }));
  }, []);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(getDefaultFilters());
  }, []);
  
  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);
  
  // Reset everything
  const reset = useCallback(() => {
    setQuery('');
    setFilters(getDefaultFilters());
    setSortBy('relevance');
  }, []);
  
  return {
    query,
    setQuery,
    filters,
    toggleFilter,
    setDateRange,
    clearFilters,
    clearSearch,
    reset,
    sortBy,
    setSortBy,
    results,
    totalResults: results.length,
  };
};

/**
 * Hook for managing UI state (mobile drawer, scroll position)
 */
export const useArchiveUI = () => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsSticky(position > 400); // Make sticky after 400px scroll
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(prev => !prev);
  }, []);
  
  const closeFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(false);
  }, []);
  
  return {
    isFilterDrawerOpen,
    toggleFilterDrawer,
    closeFilterDrawer,
    isSticky,
    scrollPosition,
  };
};

/**
 * Hook for managing search sorting
 */
export const useSorting = () => {
  const [sortBy, setSortBy] = useState('relevance');
  
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'date-newest', label: 'Newest First' },
    { value: 'date-oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title (A-Z)' },
  ];
  
  return { sortBy, setSortBy, sortOptions };
};
