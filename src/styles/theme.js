/**
 * HISTORICAL ARCHIVE STYLING CONSTANTS
 * 
 * Color palette & design tokens for aged document aesthetic
 */

export const archiveColors = {
  // Primary palette - warm, historical tones
  parchment: '#F5F1E8',      // Aged paper background
  cream: '#FAF8F3',           // Lighter cream
  sepia: '#D4AF8F',           // Warm brownish tone
  darkBrown: '#5C4033',       // Deep brown for text
  lightBrown: '#8B7355',      // Medium brown accents
  
  // Accent colors
  rust: '#A0522D',            // Rustic accent
  gold: '#D4AF37',            // Golden highlights
  
  // Functional
  accent: '#C85A54',          // Result highlights
  link: '#7B3F00',            // Dark historical links
};

export const archiveTypography = {
  // Historical feel with modern readability
  headingFont: 'font-serif',  // "Playfair Display" or serif fallback
  bodyFont: 'font-sans',       // Clean sans-serif for readability
};

/**
 * Reusable Tailwind class combinations
 */
export const archiveClasses = {
  // Cards & containers
  card: 'bg-parchment border border-sepia/30 shadow-lg shadow-darkBrown/10 rounded-sm',
  cardHover: 'hover:shadow-xl hover:shadow-darkBrown/20 transition-shadow duration-300',
  
  // Text elements
  headingXL: 'font-serif text-4xl font-bold text-darkBrown',
  headingLG: 'font-serif text-3xl font-bold text-darkBrown',
  headingMD: 'font-serif text-2xl font-semibold text-darkBrown',
  headingSM: 'font-serif text-lg font-semibold text-darkBrown',
  
  bodyLarge: 'text-base text-darkBrown/90 font-serif',
  bodyNormal: 'text-sm text-darkBrown/80 leading-relaxed',
  bodySmall: 'text-xs text-darkBrown/70',
  
  // Buttons
  buttonPrimary: 'bg-rust hover:bg-rust/90 text-cream px-6 py-2 rounded transition-colors',
  buttonSecondary: 'border border-sepia bg-cream hover:bg-parchment text-darkBrown px-4 py-2 rounded transition-colors',
  buttonSmall: 'px-3 py-1 text-xs font-medium rounded transition-colors',
  
  // Badges & tags
  badge: 'inline-block px-3 py-1 text-xs font-serif bg-gold/20 text-rust border border-gold/40 rounded-full',
  tag: 'inline-block px-2 py-1 text-xs bg-sepia/10 text-darkBrown border border-sepia/30 rounded',
  
  // Input & search
  input: 'w-full px-4 py-3 bg-cream border border-sepia/50 rounded text-darkBrown placeholder-darkBrown/50 focus:outline-none focus:ring-2 focus:ring-rust focus:border-transparent',
  
  // Dividers
  divider: 'border-t border-sepia/20',
  
  // Filters
  filterSection: 'pb-4 mb-4 border-b border-sepia/20 last:border-b-0',
};

/**
 * Aged paper texture background
 * SVG pattern for subtle authenticity
 */
export const agedPaperPattern = `
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
    </filter>
  </defs>
  <rect width="100" height="100" fill="#F5F1E8" filter="url(#noise)" opacity="0.5"/>
</svg>
`;

/**
 * Hero section background with historical aesthetic
 */
export const heroBackgroundStyle = {
  background: 'linear-gradient(135deg, rgba(245,241,232,0.95) 0%, rgba(212,175,143,0.1) 100%)',
  backgroundAttachment: 'fixed',
};

/**
 * Result card paper shadow effect
 */
export const paperShadowStyle = {
  boxShadow: `
    0 1px 3px rgba(0,0,0,0.12),
    0 1px 2px rgba(0,0,0,0.24),
    0 2px 5px rgba(92, 64, 51, 0.1)
  `,
};

/**
 * Smooth transition animation
 */
export const transitionDuration = 'duration-300';
export const transitionTiming = 'ease-in-out';

/**
 * Breakpoints for responsive design
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Z-index layering
 */
export const zIndex = {
  filterDrawer: 40,
  stickySearch: 30,
  modal: 50,
};
