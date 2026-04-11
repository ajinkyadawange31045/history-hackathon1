/**
 * FILTER LOGIC & UTILITIES
 * 
 * Handles multi-select filtering across:
 * - Document Type
 * - Date Range
 * - Region
 * - Language
 * - Subjects
 * - Holding Institution
 */

/**
 * Apply filters to search results
 * Uses AND logic: all selected filters must match
 */
export const applyFilters = (documents, filters) => {
  return documents.filter(doc => {
    // Type filter (multi-select)
    if (filters.types.length > 0 && !filters.types.includes(doc.type)) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const docDate = new Date(doc.date);
      if (filters.dateRange.start && docDate < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && docDate > new Date(filters.dateRange.end)) {
        return false;
      }
    }
    
    // Region filter (multi-select)
    if (filters.regions.length > 0 && !filters.regions.includes(doc.region)) {
      return false;
    }
    
    // Language filter (multi-select)
    if (filters.languages.length > 0 && !filters.languages.includes(doc.language)) {
      return false;
    }
    
    // Subjects filter (multi-select, OR logic within subject array)
    if (filters.subjects.length > 0) {
      const hasSubject = filters.subjects.some(subject =>
        doc.subjects?.includes(subject)
      );
      if (!hasSubject) return false;
    }
    
    // Institution filter (multi-select)
    if (filters.institutions.length > 0 && !filters.institutions.includes(doc.holdingInstitution)) {
      return false;
    }
    
    return true;
  });
};

/**
 * Initialize default filter state
 */
export const getDefaultFilters = () => ({
  types: [],
  dateRange: { start: null, end: null },
  regions: [],
  languages: [],
  subjects: [],
  institutions: [],
});

/**
 * Extract unique values from documents for filter options
 */
export const extractFilterOptions = (documents, metadata) => ({
  types: metadata?.documentTypes || [...new Set(documents.map(d => d.type))],
  regions: metadata?.regions || [...new Set(documents.map(d => d.region))],
  languages: [...new Set(documents.map(d => d.language))],
  subjects: [...new Set(documents.flatMap(d => d.subjects || []))],
  institutions: metadata?.holdingInstitutions || 
    [...new Set(documents.map(d => d.holdingInstitution))],
});

/**
 * Get document date range for slider initialization
 */
export const getDateRange = (documents) => {
  const dates = documents
    .map(d => new Date(d.date).getTime())
    .filter(d => !isNaN(d))
    .sort((a, b) => a - b);
  
  if (dates.length === 0) {
    return { min: 0, max: 0 };
  }
  
  return {
    min: Math.floor(dates[0] / (365.25 * 24 * 60 * 60 * 1000)), // Convert to years
    max: Math.ceil(dates[dates.length - 1] / (365.25 * 24 * 60 * 60 * 1000)),
  };
};

/**
 * Format year for display
 */
export const formatYear = (timestamp) => {
  const ms = timestamp * 365.25 * 24 * 60 * 60 * 1000;
  return new Date(ms).getFullYear();
};

/**
 * Check if any filters are active
 */
export const hasActiveFilters = (filters) => {
  return (
    filters.types.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.regions.length > 0 ||
    filters.languages.length > 0 ||
    filters.subjects.length > 0 ||
    filters.institutions.length > 0
  );
};

/**
 * Clear all filters
 */
export const clearAllFilters = () => getDefaultFilters();

/**
 * Toggle filter option (add/remove)
 */
export const toggleFilterOption = (filters, category, value) => {
  const newFilters = { ...filters };
  const array = newFilters[category];
  
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  } else {
    array.push(value);
  }
  
  return newFilters;
};

/**
 * Update multiple filters at once
 */
export const updateFilters = (filters, updates) => ({
  ...filters,
  ...updates,
});

/**
 * Get filter statistics (how many results per option)
 */
export const getFilterStats = (documents, category) => {
  const stats = {};
  
  const fieldMap = {
    types: 'type',
    regions: 'region',
    languages: 'language',
    subjects: 'subjects', // Array field
    institutions: 'holdingInstitution',
  };
  
  const field = fieldMap[category];
  
  documents.forEach(doc => {
    if (Array.isArray(doc[field])) {
      doc[field].forEach(value => {
        stats[value] = (stats[value] || 0) + 1;
      });
    } else {
      const value = doc[field];
      stats[value] = (stats[value] || 0) + 1;
    }
  });
  
  return stats;
};
