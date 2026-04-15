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
export const DocumentCard = ({ document, searchQuery }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Function to highlight text if search query exists
  const highlightIfSearched = (text) => {
    if (!searchQuery || !text) return text;
    return highlightText(text, searchQuery, {
      className: 'search-highlight highlight-animation',
      maxHighlights: 10
    });
  };
  
  const handleCardClick = (e) => {
    e.preventDefault();
    navigate(`/document/${document.id}`);
  };
  
  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer h-full overflow-hidden rounded-lg transition-all duration-300"
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
            className="inline-block px-3 py-1 text-xs font-sans font-semibold rounded-full shadow-sm transition-all duration-300 group-hover:shadow-md"
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
      <div className="p-4 md:p-5 flex flex-col h-full gap-3">
        
        {/* META HEADER - Date and Type Context */}
        <div className="flex items-center justify-between">
          <time
            className="text-xs font-sans tracking-wide transition-colors duration-300 group-hover:opacity-100"
            style={{ color: archiveColors.darkBrown, opacity: 0.55 }}
          >
            {formatDate(document.date)}
          </time>
        </div>
        
        {/* SEPARATOR - elegant divider */}
        <div
          style={{
            height: '1px',
            background: `linear-gradient(to right, ${archiveColors.sepia}40, ${archiveColors.sepia}10)`,
          }}
        />
        
        {/* TITLE - serif, strong hierarchy */}
        <div className="flex-shrink-0">
          <h3
            className="font-serif text-base md:text-lg font-bold line-clamp-2 transition-all duration-300 group-hover:text-rust group-hover:underline group-hover:underline-offset-2 group-hover:scale-[1.02] cursor-pointer"
            style={{ color: archiveColors.darkBrown }}
            dangerouslySetInnerHTML={{ __html: highlightIfSearched(document.title) }}
          />
        </div>
        
        {/* DESCRIPTION - refined preview */}
        <p
          className="font-sans text-xs md:text-sm line-clamp-2 leading-relaxed transition-opacity duration-300 group-hover:opacity-100"
          style={{ color: archiveColors.darkBrown, opacity: 0.70 }}
          dangerouslySetInnerHTML={{ __html: highlightIfSearched(document.description) }}
        />
        
        {/* METADATA SECTION - professional layout with icons */}
        <div className="space-y-2 text-xs">
          {/* Location with icon */}
          <div className="flex items-center gap-2">
            <svg 
              className="w-3.5 h-3.5 flex-shrink-0" 
              style={{ color: archiveColors.rust, opacity: 0.7 }}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span 
              className="font-sans text-sm truncate" 
              style={{ color: archiveColors.darkBrown }}
              dangerouslySetInnerHTML={{ __html: highlightIfSearched(`${document.place}, ${document.region}`) }}
            />
          </div>
          
          {/* Author with icon */}
          {document.author && (
            <div className="flex items-center gap-2">
              <svg 
                className="w-3.5 h-3.5 flex-shrink-0" 
                style={{ color: archiveColors.rust, opacity: 0.7 }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span 
                className="font-sans text-sm truncate" 
                style={{ color: archiveColors.darkBrown }}
                dangerouslySetInnerHTML={{ __html: highlightIfSearched(document.author) }}
              />
            </div>
          )}
          
          {/* Language with icon */}
          {document.language && (
            <div className="flex items-center gap-2">
              <svg 
                className="w-3.5 h-3.5 flex-shrink-0" 
                style={{ color: archiveColors.rust, opacity: 0.7 }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
              </svg>
              <span 
                className="font-sans text-sm truncate" 
                style={{ color: archiveColors.darkBrown }}
                dangerouslySetInnerHTML={{ __html: highlightIfSearched(document.language) }}
              />
            </div>
          )}
        </div>
        
        {/* CTA FOOTER - elegant separator and link */}
        <div className="pt-3" style={{ borderTop: `1px solid ${archiveColors.sepia}25` }}>
          <button
            onClick={handleCardClick}
            className="font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:gap-1 flex items-center gap-0.5 group/btn"
            style={{ color: archiveColors.rust }}
          >
            View Details
            <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </article>
  );
};

/**
 * DOCUMENT CARD SKELETON
 * Loading placeholder with shimmer animation
 * Maintains layout while content loads for smooth UX
 */
export const DocumentCardSkeleton = () => {
  const shimmerGradient = 'linear-gradient(90deg, rgba(244,244,245,0.2) 25%, rgba(244,244,245,0.5) 50%, rgba(244,244,245,0.2) 75%)';
  
  return (
    <div
      className="h-full rounded-lg overflow-hidden animate-pulse"
      style={{
        backgroundColor: archiveColors.cream,
        boxShadow: `
          0 4px 6px -1px rgba(92, 64, 51, 0.08),
          0 2px 4px -1px rgba(92, 64, 51, 0.04)
        `,
        borderLeft: `4px solid ${archiveColors.sepia}40`,
        borderTop: `1px solid ${archiveColors.sepia}33`,
        borderRight: `1px solid ${archiveColors.sepia}1A`,
        borderBottom: `1px solid ${archiveColors.sepia}1A`,
      }}
    >
      {/* Image placeholder */}
      <div
        className="w-full h-40 md:h-44 bg-gradient-to-r"
        style={{
          backgroundImage: shimmerGradient,
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />
      
      {/* Content placeholder */}
      <div className="p-4 md:p-5 space-y-3">
        {/* Date skeleton */}
        <div
          className="h-3 rounded w-24"
          style={{
            backgroundImage: shimmerGradient,
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
        
        {/* Divider */}
        <div
          className="h-px w-full mt-2"
          style={{
            backgroundImage: shimmerGradient,
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
        
        {/* Title skeleton - 2 lines */}
        <div className="space-y-2">
          <div
            className="h-4 rounded w-full"
            style={{
              backgroundImage: shimmerGradient,
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
          <div
            className="h-4 rounded w-4/5"
            style={{
              backgroundImage: shimmerGradient,
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>
        
        {/* Description skeleton - 2 lines */}
        <div className="space-y-2">
          <div
            className="h-3 rounded w-full"
            style={{
              backgroundImage: shimmerGradient,
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
          <div
            className="h-3 rounded w-4/5"
            style={{
              backgroundImage: shimmerGradient,
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>
        
        {/* Metadata grid skeleton */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div
                className="h-2.5 rounded w-12"
                style={{
                  backgroundImage: shimmerGradient,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite',
                }}
              />
              <div
                className="h-3 rounded w-full"
                style={{
                  backgroundImage: shimmerGradient,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite',
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-2 pt-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-5 rounded px-2"
              style={{
                width: `${50 + Math.random() * 40}px`,
                backgroundImage: shimmerGradient,
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite',
              }}
            />
          ))}
        </div>
        
        {/* CTA skeleton */}
        <div
          className="h-6 rounded w-20 mt-auto pt-3"
          style={{
            backgroundImage: shimmerGradient,
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

/**
 * RESULTS GRID
 * Display multiple document cards in responsive grid (3 per row)
 */
export const ResultsGrid = ({ documents, totalResults, isLoading = false, searchQuery }) => {
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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map(document => (
        <DocumentCard key={document.id} document={document} searchQuery={searchQuery} />
      ))}
    </div>
  );
};

export default DocumentCard;
