import React, { useState } from 'react';
import { archiveColors, archiveClasses } from '../styles/theme';

/**
 * HERO SECTION
 * Large search bar with aged paper aesthetic
 * Main entry point for archive exploration
 */
export const HeroSection = ({ onSearch, onSubmit }) => {
  const [localQuery, setLocalQuery] = useState('');
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    onSearch(value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(localQuery);
  };
  
  return (
    <div
      className="w-full py-20 md:py-24 px-4"
      style={{
        background: 'linear-gradient(135deg, #F5F1E8 0%, #E8D5C4 50%, #D4B896 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Aged paper texture overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235C4033' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Title */}
        <h1
          className={`${archiveClasses.headingXL} mb-4 tracking-wide`}
          style={{ color: archiveColors.darkBrown }}
        >
          Explore the Archives of Time
        </h1>
        
        {/* Subtitle */}
        <p
          className="text-lg mb-12"
          style={{ color: archiveColors.darkBrown, opacity: 0.75 }}
        >
          Discover historical documents, manuscripts, and artifacts from across the globe
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            placeholder="Search by title, place, subject, or keyword..."
            value={localQuery}
            onChange={handleInputChange}
            className={`
              w-full px-6 py-4 text-base
              bg-white border-2 rounded-lg
              shadow-lg
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-offset-2
              placeholder-gray-400
            `}
            style={{
              borderColor: archiveColors.sepia,
              color: archiveColors.darkBrown,
              boxShadow: `0 4px 12px rgba(92, 64, 51, 0.15)`,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = archiveColors.rust;
              e.target.style.boxShadow = `0 6px 16px rgba(160, 82, 45, 0.2)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = archiveColors.sepia;
              e.target.style.boxShadow = `0 4px 12px rgba(92, 64, 51, 0.15)`;
            }}
          />
          
          {/* Search Icon */}
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2"
            style={{ color: archiveColors.rust }}
            title="Search"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>
        
        {/* Quick hints */}
        <p className="text-xs mt-6" style={{ color: archiveColors.darkBrown, opacity: 0.6 }}>
          Tip: Search by place name, document type, time period, or subject matter
        </p>
      </div>
    </div>
  );
};

/**
 * STICKY SEARCH BAR
 * Compact search bar that appears after scrolling past hero
 * Maintains search context while browsing
 */
export const StickySearchBar = ({ query, onSearch, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-30
        border-b transition-all duration-300
        ${isVisible ? 'shadow-md' : ''}
      `}
      style={{
        backgroundColor: archiveColors.parchment,
        borderColor: archiveColors.sepia,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Compact Search Input */}
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search archive..."
            className={`
              w-full px-4 py-2 text-sm
              bg-white border rounded
              focus:outline-none focus:ring-2
              transition-colors
            `}
            style={{
              borderColor: archiveColors.sepia,
              color: archiveColors.darkBrown,
            }}
          />
        </div>
        
        {/* Info text */}
        <p className="text-xs whitespace-nowrap" style={{ color: archiveColors.darkBrown, opacity: 0.6 }}>
          Keep exploring...
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
