import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { archiveColors, archiveClasses } from '../styles/theme';
import { getDocumentImage, getFallbackImage } from '../utils/imageUtils';

/**
 * DETAIL PAGE
 * Shows full details of a manuscript/document
 */
export const DetailPage = ({ documents }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const document = documents.find(doc => doc.id === parseInt(id));
  
  if (!document) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: archiveColors.cream }}
      >
        <div className="text-center">
          <h1 style={{ color: archiveColors.darkBrown }} className="text-2xl font-bold mb-4">
            Document Not Found
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 rounded transition-all hover:shadow-lg"
            style={{
              backgroundColor: archiveColors.rust,
              color: archiveColors.cream,
            }}
          >
            Back to Archive
          </button>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const loremIpsum = {
    short: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    medium: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    long: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  };
  
  return (
    <div style={{ backgroundColor: archiveColors.cream, minHeight: '100vh' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b shadow-sm" style={{ backgroundColor: archiveColors.parchment, borderColor: archiveColors.sepia }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 style={{ color: archiveColors.darkBrown }} className={`${archiveClasses.headingSM} text-lg md:text-2xl`}>
            Document Details
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded transition-all hover:shadow-lg font-semibold text-sm md:text-base"
            style={{
              backgroundColor: archiveColors.rust,
              color: archiveColors.cream,
            }}
          >
            ← Back to Archive
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Image */}
          <div className="md:col-span-1">
            <div
              className="rounded-lg overflow-hidden shadow-lg sticky top-24"
              style={{ backgroundColor: archiveColors.cream }}
            >
              <img
                src={getDocumentImage(document.id)}
                alt={document.title}
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '4/5' }}
                onError={(e) => {
                  e.target.src = getFallbackImage();
                }}
              />
              <div className="p-4">
                <p className="text-xs" style={{ color: archiveColors.darkBrown, opacity: 0.6 }}>
                  Reference Image
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <h2
                className={`${archiveClasses.headingLG} mb-4`}
                style={{ color: archiveColors.darkBrown }}
              >
                {document.title}
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: `${archiveColors.rust}20`,
                    color: archiveColors.rust,
                    border: `1px solid ${archiveColors.rust}`,
                  }}
                >
                  {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                </span>
                <span
                  className="px-4 py-2 rounded-full text-sm"
                  style={{
                    backgroundColor: `${archiveColors.gold}15`,
                    color: archiveColors.darkBrown,
                  }}
                >
                  {formatDate(document.date)}
                </span>
              </div>
              
              <div
                className="h-px my-6"
                style={{ backgroundColor: archiveColors.sepia, opacity: 0.2 }}
              />
            </div>
            
            {/* Description */}
            <div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: archiveColors.darkBrown }}
              >
                Description
              </h3>
              <p
                className={`${archiveClasses.bodyNormal} leading-relaxed`}
                style={{ color: archiveColors.darkBrown, opacity: 0.85 }}
              >
                {document.description}
              </p>
              <p
                className={`${archiveClasses.bodySmall} leading-relaxed mt-4`}
                style={{ color: archiveColors.darkBrown, opacity: 0.7 }}
              >
                {loremIpsum.long}
              </p>
            </div>
            
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-6">
              {document.place && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: archiveColors.darkBrown, opacity: 0.5 }}>
                    PLACE
                  </p>
                  <p style={{ color: archiveColors.darkBrown }} className="font-semibold">
                    {document.place}
                  </p>
                </div>
              )}
              
              {document.region && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: archiveColors.darkBrown, opacity: 0.5 }}>
                    REGION
                  </p>
                  <p style={{ color: archiveColors.darkBrown }} className="font-semibold">
                    {document.region}
                  </p>
                </div>
              )}
              
              {document.holdingInstitution && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: archiveColors.darkBrown, opacity: 0.5 }}>
                    HOLDING INSTITUTION
                  </p>
                  <p style={{ color: archiveColors.darkBrown }} className="font-semibold">
                    {document.holdingInstitution}
                  </p>
                </div>
              )}
              
              {document.language && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: archiveColors.darkBrown, opacity: 0.5 }}>
                    LANGUAGE
                  </p>
                  <p style={{ color: archiveColors.darkBrown }} className="font-semibold">
                    {document.language}
                  </p>
                </div>
              )}
              
              {document.author && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: archiveColors.darkBrown, opacity: 0.5 }}>
                    AUTHOR
                  </p>
                  <p style={{ color: archiveColors.darkBrown }} className="font-semibold">
                    {document.author}
                  </p>
                </div>
              )}
              
              {document.format && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: archiveColors.darkBrown, opacity: 0.5 }}>
                    FORMAT
                  </p>
                  <p style={{ color: archiveColors.darkBrown }} className="font-semibold">
                    {document.format}
                  </p>
                </div>
              )}
              
              {document.collection && (
                <div className="col-span-2">
                  <p className="text-xs font-semibold mb-2" style={{ color: archiveColors.darkBrown, opacity: 0.5 }}>
                    COLLECTION
                  </p>
                  <p style={{ color: archiveColors.darkBrown }} className="font-semibold">
                    {document.collection}
                  </p>
                </div>
              )}
            </div>
            
            {/* Subjects */}
            {document.subjects && document.subjects.length > 0 && (
              <div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: archiveColors.darkBrown }}
                >
                  Subjects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {document.subjects.map(subject => (
                    <span
                      key={subject}
                      className="px-3 py-1 rounded text-sm"
                      style={{
                        backgroundColor: `${archiveColors.gold}20`,
                        color: archiveColors.rust,
                        border: `1px solid ${archiveColors.gold}40`,
                      }}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Keywords */}
            {document.keywords && document.keywords.length > 0 && (
              <div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: archiveColors.darkBrown }}
                >
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {document.keywords.map(keyword => (
                    <span
                      key={keyword}
                      className="px-3 py-1 rounded text-sm"
                      style={{
                        backgroundColor: `${archiveColors.sepia}15`,
                        color: archiveColors.darkBrown,
                        opacity: 0.7,
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Full Description Section */}
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: archiveColors.parchment }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: archiveColors.darkBrown }}
              >
                Historical Context & Additional Information
              </h3>
              <p
                className={`${archiveClasses.bodySmall} leading-relaxed`}
                style={{ color: archiveColors.darkBrown, opacity: 0.8 }}
              >
                {loremIpsum.medium}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
