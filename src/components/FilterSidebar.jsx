import React, { useState, useMemo } from 'react';
import { archiveColors, archiveClasses } from '../styles/theme';
import { extractFilterOptions, getDateRange } from '../utils/filterLogic';

/**
 * FILTER SIDEBAR
 * Desktop: Fixed left sidebar
 * Mobile: Collapsible drawer (separate component)
 */
export const FilterSidebar = ({
  documents,
  metadata,
  filters,
  onToggleFilter,
  onSetDateRange,
  onClearFilters,
  className = '',
}) => {
  const filterOptions = extractFilterOptions(documents, metadata);
  const dateRange = useMemo(() => getDateRange(documents), [documents]);
  const [expandedSections, setExpandedSections] = useState({
    types: false,
    regions: false,
    dateRange: false,
    languages: false,
    subjects: false,
    institutions: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const CheckboxGroup = ({ section, label, options, selected }) => (
    <div className={archiveClasses.filterSection}>
      {/* Section Header */}
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between mb-3 hover:text-rust transition-colors"
        style={{ color: archiveColors.darkBrown }}
      >
        <h3 className={`${archiveClasses.headingSM} text-sm`}>{label}</h3>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`transition-transform ${expandedSections[section] ? 'rotate-180' : ''}`}
        >
          <path d="M3.5 5.5l4.5 4.5 4.5-4.5" stroke="currentColor" fill="none" strokeWidth="2" />
        </svg>
      </button>

      {/* Checkboxes */}
      {expandedSections[section] && (
        <div className="space-y-2 mb-4">
          {options.slice(0, 10).map(option => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggleFilter(section, option)}
                className="w-4 h-4 rounded accent-rust"
                style={{
                  accentColor: archiveColors.rust,
                }}
              />
              <span
                className="text-sm group-hover:text-rust transition-colors"
                style={{ color: archiveColors.darkBrown, opacity: 0.8 }}
              >
                {option}
              </span>
            </label>
          ))}
          {options.length > 10 && (
            <p
              className="text-xs mt-2 italic"
              style={{ color: archiveColors.darkBrown, opacity: 0.5 }}
            >
              +{options.length - 10} more
            </p>
          )}
        </div>
      )}
    </div>
  );

  const hasFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') {
      return Object.values(value).some(v => v);
    }
    return value;
  });

  return (
    <aside
      className={className}
      style={{
        backgroundColor: archiveColors.parchment,
        borderRight: `1px solid ${archiveColors.sepia}30`,
      }}
    >
      {/* Filters Title */}
      <h2
        className={`${archiveClasses.headingMD} mb-6 pb-4 border-b p-6 pb-4`}
        style={{
          borderColor: archiveColors.sepia,
          color: archiveColors.darkBrown,
        }}
      >
        Refine Search
      </h2>

      <div className="px-6 space-y-4">
        {/* Type Filter */}
        <CheckboxGroup
          section="types"
          label="Document Type"
          options={filterOptions.types}
          selected={filters.types}
        />

        {/* Region Filter */}
        <CheckboxGroup
          section="regions"
          label="Region"
          options={filterOptions.regions}
          selected={filters.regions}
        />

        {/* Date Range Filter */}
        {onSetDateRange && (
          <div className={archiveClasses.filterSection}>
            {/* Section Header */}
            <button
              onClick={() => toggleSection('dateRange')}
              className="w-full flex items-center justify-between mb-3 hover:text-rust transition-colors"
              style={{ color: archiveColors.darkBrown }}
            >
              <h3 className={`${archiveClasses.headingSM} text-sm`}>Date Range</h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                className={`transition-transform ${expandedSections.dateRange ? 'rotate-180' : ''}`}
              >
                <path d="M3.5 5.5l4.5 4.5 4.5-4.5" stroke="currentColor" fill="none" strokeWidth="2" />
              </svg>
            </button>

            {/* Date Range Inputs */}
            {expandedSections.dateRange && (
              <div className="space-y-3 mb-4">
                <div>
                  <label
                    className="text-xs font-semibold"
                    style={{ color: archiveColors.darkBrown, opacity: 0.6 }}
                  >
                    From
                  </label>
                  <input
                    type="date"
                    value={filters.dateRange.start || ''}
                    onChange={(e) => onSetDateRange(e.target.value, filters.dateRange.end)}
                    className="w-full mt-1 px-3 py-2 border rounded text-sm"
                    style={{
                      borderColor: archiveColors.sepia,
                      color: archiveColors.darkBrown,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="text-xs font-semibold"
                    style={{ color: archiveColors.darkBrown, opacity: 0.6 }}
                  >
                    To
                  </label>
                  <input
                    type="date"
                    value={filters.dateRange.end || ''}
                    onChange={(e) => onSetDateRange(filters.dateRange.start, e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded text-sm"
                    style={{
                      borderColor: archiveColors.sepia,
                      color: archiveColors.darkBrown,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Language Filter */}
        <CheckboxGroup
          section="languages"
          label="Language"
          options={filterOptions.languages}
          selected={filters.languages}
        />

        {/* Subjects Filter */}
        <CheckboxGroup
          section="subjects"
          label="Subjects"
          options={filterOptions.subjects}
          selected={filters.subjects}
        />

        {/* Institution Filter */}
        <CheckboxGroup
          section="institutions"
          label="Holding Institution"
          options={filterOptions.institutions}
          selected={filters.institutions}
        />

        {/* Clear Filters Button */}
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className={`
              w-full mt-6 px-4 py-2 text-sm font-semibold
              border rounded transition-colors
              hover:opacity-80
            `}
            style={{
              backgroundColor: 'transparent',
              borderColor: archiveColors.rust,
              color: archiveColors.rust,
            }}
          >
            Clear All Filters
          </button>
        )}
      </div>
    </aside>
  );
};

/**
 * MOBILE FILTER DRAWER
 * Collapsible drawer for mobile devices
 */
export const FilterDrawer = ({
  isOpen,
  onClose,
  documents,
  metadata,
  filters,
  onToggleFilter,
  onSetDateRange,
  onClearFilters,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-30 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
          fixed left-0 top-0 bottom-0 z-40 w-80 max-w-full
          transitions-transform duration-300 md:hidden
          overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          backgroundColor: archiveColors.parchment,
        }}
      >
        {/* Close Button */}
        <div className="sticky top-0 flex justify-between items-center p-4 border-b"
          style={{ borderColor: archiveColors.sepia }}>
          <h2 className={archiveClasses.headingMD} style={{ color: archiveColors.darkBrown }}>
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sepia/10 rounded transition-colors"
            style={{ color: archiveColors.darkBrown }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Filters Content */}
        <FilterSidebar
          documents={documents}
          metadata={metadata}
          filters={filters}
          onToggleFilter={onToggleFilter}
          onSetDateRange={onSetDateRange}
          onClearFilters={onClearFilters}
          className=""
        />
      </div>
    </>
  );
};

export default FilterSidebar;
