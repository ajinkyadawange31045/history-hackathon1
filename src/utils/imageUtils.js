/**
 * SHARED IMAGE UTILITY
 * Provides consistent image selection for documents across all components
 * Used by: DocumentCard, DetailPage, and other components
 */

/**
 * Get a consistent archival image for a document based on its ID
 * Returns the same image regardless of where component is rendered
 * Array of curated historical/archival images from credible sources
 */
export const getDocumentImage = (docId) => {
  const images = [
    // Manuscripts & Old Books
    'https://images.unsplash.com/photo-1544640805-b745cdcd25eb?w=600&auto=format&fit=crop', // Stack of old books
    'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=600&auto=format&fit=crop', // Library shelf
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=600&auto=format&fit=crop', // Old ink & paper
    
    // Maps & Exploration
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&auto=format&fit=crop', // Vintage Map
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop', // Celestial navigation
    
    // Archaeology & Artifacts
    'https://images.unsplash.com/photo-1608506375591-b90e1f953e5b?w=600&auto=format&fit=crop', // Stone ruins
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop', // Hieroglyphs/Relief
    'https://images.unsplash.com/photo-1599110906885-b024497c27aa?w=600&auto=format&fit=crop', // Roman statues
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&auto=format&fit=crop', // Ancient pottery
    
    // Art & Craft
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&auto=format&fit=crop', // Oil painting texture
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop', // Historical sculpture
    'https://images.unsplash.com/photo-1614705827065-65c3674a933d?w=600&auto=format&fit=crop', // Wax seal/Letters
    'https://images.unsplash.com/photo-1597166133261-073c68b693e5?w=600&auto=format&fit=crop', // Medieval architecture
    
    // Architecture & Interiors
    'https://images.unsplash.com/photo-1491843351663-7c1161d719b5?w=600&auto=format&fit=crop', // Library hall
    'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=600&auto=format&fit=crop', // Antique study
    
    // Maritime & Navigation
    'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=600&auto=format&fit=crop', // Old ship/boat
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop', // Maritime instruments
    
    // Cultural Heritage
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop', // Traditional architecture
    'https://images.unsplash.com/photo-1594736797933-d0acc24019c5?w=600&auto=format&fit=crop', // Historical textiles
    
    // Scientific & Academic
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop', // Scientific instruments
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop', // Antique globes
    
    // Nature & Archaeology
    'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=600&auto=format&fit=crop', // Desert ruins
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&auto=format&fit=crop', // Archaeological site
  ];
  
  return images[docId % images.length];
};

/**
 * Get fallback image for error scenarios
 */
export const getFallbackImage = () => {
  return 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&auto=format&fit=crop';
};
