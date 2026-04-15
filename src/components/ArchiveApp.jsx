import React, { useEffect, useState } from 'react';
import { useArchiveSearch, useArchiveUI } from '../hooks/useArchiveSearch';
import { HeroSection, StickySearchBar } from './HeroSection';
import { FilterSidebar, FilterDrawer } from './FilterSidebar';
import { ResultsGrid } from './DocumentCard';
import { Pagination } from './Pagination';
import { archiveColors } from '../styles/theme';

/**
 * MAIN APPLICATION COMPONENT
 * Orchestrates: hero section, search, filters, results display, and pagination
 */
export const ArchiveApp = ({ data }) => {
  const documents = data?.documents || [];
  const metadata = data?.metadata || {};
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Initialize search state
  const {
    query,
    setQuery,
    filters,
    toggleFilter,
    setDateRange,
    clearFilters,
    clearSearch,
    results,
    totalResults,
    sortBy,
    setSortBy,
    searchField,
    setSearchField,
    viewMode,
    setViewMode,
  } = useArchiveSearch(documents, metadata);
  
  // Initialize UI state
  const {
    isFilterDrawerOpen,
    toggleFilterDrawer,
    closeFilterDrawer,
    isSticky,
  } = useArchiveUI();
  
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date-newest', label: 'Newest First' },
    { value: 'date-oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title (A-Z)' },
  ];
  
  // Reset to page 1 when filters/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, filters, sortBy, searchField]);
  
  // Calculate paginated results
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = results.slice(startIndex, endIndex);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K opens search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
      // Escape closes drawer
      if (e.key === 'Escape') {
        closeFilterDrawer();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeFilterDrawer]);
  
  return (
    <div
      style={{ backgroundColor: archiveColors.cream, minHeight: '100vh' }}
    >
      {/* Hero Section */}
      <HeroSection
        onSearch={setQuery}
        onSubmit={() => {/* Optional: analytics or tracking */}}
        searchField={searchField}
        onSearchFieldChange={setSearchField}
      />
      
      {/* Sticky Search Bar (appears after scrolling) */}
      <StickySearchBar
        query={query}
        onSearch={setQuery}
        isVisible={isSticky}
      />
      
      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto relative">
        {/* Left Sidebar - Filters (Desktop Only) */}
        <aside
          className="hidden md:block w-80 md:w-72 lg:w-80 flex-shrink-0 p-4"
          style={{ backgroundColor: archiveColors.parchment }}
        >
          <FilterSidebar
            documents={documents}
            metadata={metadata}
            filters={filters}
            onToggleFilter={toggleFilter}
            onSetDateRange={setDateRange}
            onClearFilters={clearFilters}
          />
        </aside>
        
        {/* Mobile Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={closeFilterDrawer}
          documents={documents}
          metadata={metadata}
          filters={filters}
          onToggleFilter={toggleFilter}
          onSetDateRange={setDateRange}
          onClearFilters={clearFilters}
        />
        
        {/* Main Content - Results */}
        <main className="flex-1 min-w-0 px-4 md:px-8 py-8 md:py-12">
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-6 flex gap-2">
            <button
              onClick={toggleFilterDrawer}
              className={`
                px-4 py-2 rounded border-2 font-semibold text-sm
                transition-colors flex items-center gap-2
              `}
              style={{
                borderColor: archiveColors.rust,
                color: archiveColors.rust,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${archiveColors.rust}10`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 3h14M1 8h14M1 13h14" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Filters
            </button>
            
            {/* Clear Search Button */}
            {query && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 rounded border-2 border-sepia text-sm transition-colors"
                style={{
                  color: archiveColors.darkBrown,
                  opacity: 0.6,
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = 0.6;
                }}
              >
                Clear
              </button>
            )}
          </div>
          
          {/* Controls Bar: Sort, and View Mode */}
          <div className="mb-8 flex items-center justify-end gap-6">
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-by" className="text-xs font-semibold opacity-60" style={{ color: archiveColors.darkBrown }}>Sort by:</label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 transition-all"
                  style={{ borderColor: archiveColors.sepia, color: archiveColors.darkBrown, ringColor: archiveColors.rust }}
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border rounded overflow-hidden" style={{ borderColor: archiveColors.sepia }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-2 transition-colors"
                  style={{
                    backgroundColor: viewMode === 'grid' ? archiveColors.sepia : 'white',
                    color: viewMode === 'grid' ? archiveColors.darkBrown : archiveColors.sepia,
                  }}
                  title="Grid View"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-2 transition-colors"
                  style={{
                    backgroundColor: viewMode === 'list' ? archiveColors.sepia : 'white',
                    color: viewMode === 'list' ? archiveColors.darkBrown : archiveColors.sepia,
                  }}
                  title="List View"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          
          {/* Results Summary */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p
                className="text-sm font-serif"
                style={{
                  color: archiveColors.darkBrown,
                  opacity: 0.7,
                }}
              >
                {query ? (
                  <>
                    Showing results for "<strong>{query}</strong>" in {searchField === 'all' ? 'all fields' : searchField} ({totalResults} found)
                  </>
                ) : (
                  <>Browsing all {documents.length} items</>
                )}
              </p>
            </div>
            
            {/* Active Filters Display */}
            {(query || Object.values(filters).some(f => {
              if (Array.isArray(f)) return f.length > 0;
              if (typeof f === 'object') return Object.values(f).some(v => v);
              return f;
            })) && (
              <button
                onClick={() => {
                  clearSearch();
                  clearFilters();
                  setSearchField('all');
                }}
                className="text-xs px-3 py-2 rounded border transition-colors hover:bg-white"
                style={{
                  borderColor: archiveColors.sepia,
                  color: archiveColors.darkBrown,
                  opacity: 0.6,
                }}
              >
                Reset All Search & Filters
              </button>
            )}
          </div>
          
          {/* Results Grid / List */}
          <ResultsGrid
            documents={paginatedResults}
            totalResults={totalResults}
            isLoading={false}
            searchQuery={query}
            viewMode={viewMode}
          />

          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalResults}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ArchiveApp;
