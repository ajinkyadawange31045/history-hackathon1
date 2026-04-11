import React from 'react';
import { archiveColors, archiveClasses } from '../styles/theme';

/**
 * PAGINATION COMPONENT
 * Handles page navigation for results
 */
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Calculate range of pages to show (show up to 7 page numbers)
  let pageRange = [];
  const maxPagesToShow = 7;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageRange.push(i);
  }
  
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Results Info */}
      <p
        className="text-sm"
        style={{ color: archiveColors.darkBrown, opacity: 0.7 }}
      >
        Showing <span className="font-semibold">{startItem}</span> to{' '}
        <span className="font-semibold">{endItem}</span> of{' '}
        <span className="font-semibold">{totalItems}</span> results
      </p>
      
      {/* Page Numbers */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            style={{
              backgroundColor: currentPage === 1 ? archiveColors.parchment : archiveColors.rust,
              color: currentPage === 1 ? archiveColors.darkBrown : archiveColors.cream,
            }}
          >
            ← Previous
          </button>
          
          {/* First Page (always visible) */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 rounded transition-all hover:shadow-md"
                style={{ color: archiveColors.darkBrown, opacity: 0.7 }}
              >
                1
              </button>
              {startPage > 2 && (
                <span style={{ color: archiveColors.darkBrown, opacity: 0.5 }}>
                  ...
                </span>
              )}
            </>
          )}
          
          {/* Page Range */}
          {pageRange.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className="px-3 py-2 rounded transition-all font-semibold"
              style={{
                backgroundColor:
                  page === currentPage
                    ? archiveColors.rust
                    : 'transparent',
                color:
                  page === currentPage
                    ? archiveColors.cream
                    : archiveColors.darkBrown,
                opacity: page === currentPage ? 1 : 0.6,
                border:
                  page === currentPage
                    ? `2px solid ${archiveColors.rust}`
                    : `1px solid ${archiveColors.sepia}`,
              }}
            >
              {page}
            </button>
          ))}
          
          {/* Last Page (always visible) */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span style={{ color: archiveColors.darkBrown, opacity: 0.5 }}>
                  ...
                </span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 rounded transition-all hover:shadow-md"
                style={{ color: archiveColors.darkBrown, opacity: 0.7 }}
              >
                {totalPages}
              </button>
            </>
          )}
          
          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            style={{
              backgroundColor: currentPage === totalPages ? archiveColors.parchment : archiveColors.rust,
              color: currentPage === totalPages ? archiveColors.darkBrown : archiveColors.cream,
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
