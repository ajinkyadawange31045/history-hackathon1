import React from 'react';
import { useNavigate } from 'react-router-dom';
import { archiveColors, archiveClasses } from '../styles/theme';
import { getDocumentImage, getFallbackImage } from '../utils/imageUtils';
import { highlightText, extractSearchTerms } from '../utils/highlightText.jsx';
import '../styles/highlight.css';

/**
 * DOCUMENT CARD - REFINED HISTORICAL DESIGN
 * Refined archival record with improved typography, spacing, and interactions
 * Features: serif/sans-serif hierarchy, soft shadows, accent borders, smooth transitions
 */
export const DocumentCard = ({ document, searchQuery, searchField = 'all' }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Function to highlight text IF it's part of the current search field
  const highlightIfSearched = (text, fieldName) => {
    if (!searchQuery || !text) return text;
    
    // Only highlight if searching 'all' or if this specific field is selected
    const shouldHighlight = searchField === 'all' || searchField === fieldName;
    
    if (!shouldHighlight) return text;

    return highlightText(text, searchQuery, {
      className: 'search-highlight highlight-animation',
      maxHighlights: 10
    });
  };

  // Determine why this document matched if not in title
  const getMatchContext = () => {
    if (!searchQuery || searchField !== 'all') return null;
    
    const q = searchQuery.toLowerCase();
    const normalizedTitle = document.title?.toLowerCase() || '';
    if (normalizedTitle.includes(q)) return null; 

    if (document.place?.toLowerCase().includes(q) || document.region?.toLowerCase().includes(q)) {
      return `Matched in location: ${document.place}`;
    }
    if (document.author?.toLowerCase().includes(q)) {
      return `Matched in author: ${document.author}`;
    }
    if (document.subjects?.some(s => s.toLowerCase().includes(q))) {
      return `Matched in subjects`;
    }
    if (document.description?.toLowerCase().includes(q)) {
      return `Matched in description`;
    }
    return null;
  };

  const matchContext = getMatchContext();
  
  const handleCardClick = (e) => {
    e.preventDefault();
    navigate(`/document/${document.id}`);
  };
  
  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer h-full overflow-hidden rounded-lg transition-all duration-300 flex flex-col"
      style={{
        backgroundColor: archiveColors.cream,
        boxShadow: `
          0 4px 6px -1px rgba(92, 64, 51, 0.08),
          0 2px 4px -1px rgba(92, 64, 51, 0.04)
        `,
        borderLeft: `4px solid ${archiveColors.rust}`,
        borderTop: `1px solid ${archiveColors.sepia}33`,
        borderRight: `1px solid ${archiveColors.sepia}1A`,
        borderBottom: `1px solid ${archiveColors.sepia}1A`,
      }}
    >
      {/* IMAGE SECTION - with subtle overlay */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 h-40 md:h-44">
        <img
          src={getDocumentImage(document.id)}
          alt={document.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          onError={(e) => {
            e.target.src = getFallbackImage();
          }}
        />
        
        {/* Subtle overlay on hover */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-300 group-hover:opacity-5 opacity-0"
        />
        
        {/* TYPE BADGE - refined styling */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-block px-3 py-1 text-xs font-sans font-semibold rounded-full shadow-sm"
            style={{
              backgroundColor: archiveColors.rust,
              color: archiveColors.cream,
              letterSpacing: '0.5px',
            }}
          >
            {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
          </span>
        </div>
      </div>
      
      {/* CONTENT SECTION */}
      <div className="p-4 md:p-5 flex flex-col flex-1 gap-3">
        
        {/* META HEADER */}
        <div className="flex items-center justify-between">
          <time
            className="text-xs font-sans tracking-wide opacity-55"
            style={{ color: archiveColors.darkBrown }}
          >
            {formatDate(document.date)}
          </time>
          {matchContext && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-200">
              Result Match
            </span>
          )}
        </div>
        
        <div
          style={{
            height: '1px',
            background: `linear-gradient(to right, ${archiveColors.sepia}40, ${archiveColors.sepia}10)`,
          }}
        />
        
        {/* TITLE */}
        <div className="flex-shrink-0">
          <h3
            className="font-serif text-base md:text-lg font-bold line-clamp-2 transition-colors group-hover:text-rust"
            style={{ color: archiveColors.darkBrown }}
            dangerouslySetInnerHTML={{ __html: highlightIfSearched(document.title, 'title') }}
          />
        </div>

        {/* MATCH CONTEXT (if not title match) */}
        {matchContext && (
          <div className="text-[10px] font-sans italic opacity-70" style={{ color: archiveColors.rust }}>
            {matchContext}
          </div>
        )}

        
        {/* DESCRIPTION */}
        <p
          className="font-sans text-xs md:text-sm line-clamp-2 leading-relaxed opacity-70"
          style={{ color: archiveColors.darkBrown }}
          dangerouslySetInnerHTML={{ __html: highlightIfSearched(document.description, 'description') }}
        />
        
        {/* METADATA SECTION */}
        <div className="mt-auto pt-3 space-y-2 text-xs">
          {/* Location */}
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span 
              className="truncate" 
              style={{ color: archiveColors.darkBrown }}
              dangerouslySetInnerHTML={{ __html: highlightIfSearched(`${document.place}`, 'all') }}
            />
          </div>
          
          {/* Author */}
          {document.author && (
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span 
                className="truncate" 
                style={{ color: archiveColors.darkBrown }}
                dangerouslySetInnerHTML={{ __html: highlightIfSearched(document.author, 'all') }}
              />
            </div>
          )}
        </div>
        
        {/* CTA FOOTER */}
        <div className="pt-3" style={{ borderTop: `1px solid ${archiveColors.sepia}25` }}>
          <button
            onClick={handleCardClick}
            className="font-sans text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1 group/btn"
            style={{ color: archiveColors.rust }}
          >
            View Details
            <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </article>
  );
};

// ... (skeleton stays same)

/**
 * DOCUMENT LIST ROW
 */
export const DocumentListRow = ({ document, searchQuery, searchField = 'all' }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const highlightIfSearched = (text, fieldName) => {
    if (!searchQuery || !text) return text;
    const shouldHighlight = searchField === 'all' || searchField === fieldName;
    if (!shouldHighlight) return text;
    return highlightText(text, searchQuery, { className: 'search-highlight' });
  };

  const getMatchContext = () => {
    if (!searchQuery || searchField !== 'all') return null;
    const q = searchQuery.toLowerCase();
    if (document.title?.toLowerCase().includes(q)) return null;
    if (document.place?.toLowerCase().includes(q)) return `In Location: ${document.place}`;
    if (document.author?.toLowerCase().includes(q)) return `In Author: ${document.author}`;
    if (document.description?.toLowerCase().includes(q)) return `In Description`;
    return null;
  };

  const matchContext = getMatchContext();
  
  const handleRowClick = (e) => {
    e.preventDefault();
    navigate(`/document/${document.id}`);
  };
  
  return (
    <div
      onClick={handleRowClick}
      className="group cursor-pointer flex flex-col md:flex-row gap-4 p-4 mb-3 rounded-lg transition-all duration-300 hover:shadow-md border"
      style={{
        backgroundColor: archiveColors.cream,
        borderColor: `${archiveColors.sepia}40`,
        borderLeft: `4px solid ${archiveColors.rust}`,
      }}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-full md:w-32 h-24 rounded overflow-hidden">
        <img
          src={getDocumentImage(document.id)}
          alt={document.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = getFallbackImage(); }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <time className="text-[10px] font-sans uppercase tracking-wider opacity-60" style={{ color: archiveColors.darkBrown }}>
            {formatDate(document.date)} • {document.type}
          </time>
          {matchContext && (
            <span className="text-[9px] font-bold px-1.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-200">
              {matchContext}
            </span>
          )}
        </div>
        
        <h3
          className="font-serif text-lg font-bold mb-1 group-hover:text-rust transition-colors truncate"
          style={{ color: archiveColors.darkBrown }}
          dangerouslySetInnerHTML={{ __html: highlightIfSearched(document.title, 'title') }}
        />
        
        <p
          className="font-sans text-xs line-clamp-1 opacity-75 leading-relaxed"
          style={{ color: archiveColors.darkBrown }}
          dangerouslySetInnerHTML={{ __html: highlightIfSearched(document.description, 'description') }}
        />
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] opacity-60 flex items-center gap-1" style={{ color: archiveColors.darkBrown }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
              <span dangerouslySetInnerHTML={{ __html: highlightIfSearched(document.place, 'all') }} />
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: archiveColors.rust }}>
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};


/**
 * RESULTS GRID
 * Display multiple document cards in responsive grid (3 per row) or list view
 */
export const ResultsGrid = ({ 
  documents, 
  totalResults, 
  isLoading = false, 
  searchQuery, 
  searchField = 'all',
  viewMode = 'grid' 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="text-center"
          style={{ color: archiveColors.darkBrown }}
        >
          <div className="inline-block animate-spin mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" opacity="0.2" />
              <path
                d="M16 2a14 14 0 0114 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-sm">Searching the archive...</p>
        </div>
      </div>
    );
  }
  
  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="text-center"
          style={{ color: archiveColors.darkBrown }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="mx-auto mb-4 opacity-30"
          >
            <rect x="12" y="12" width="40" height="40" />
            <path d="M24 24h16M24 32h16M24 40h10" />
          </svg>
          <h3 className={`${archiveClasses.headingSM} mb-2`}>No Results Found</h3>
          <p className="text-sm opacity-75">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }
  
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col">
        {documents.map(document => (
          <DocumentListRow 
            key={document.id} 
            document={document} 
            searchQuery={searchQuery} 
            searchField={searchField}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map(document => (
        <DocumentCard 
          key={document.id} 
          document={document} 
          searchQuery={searchQuery} 
          searchField={searchField}
        />
      ))}
    </div>
  );
};




export default DocumentCard;
