// Utility to dynamically set HTML document title and Open Graph meta tags
export const setProductMetaTags = (product) => {
  if (!product) return;

  const title = `${product.name} | MILIVA Skincare`;
  const description = product.shortDescription || product.description || 'Discover luxury dermatologically tested formulations by MILIVA Skincare.';
  const imageUrl = product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop';
  const url = window.location.href;

  // Set Document Title
  document.title = title;

  // Helper to update or create meta tag
  const setMetaTag = (property, name, content) => {
    let element = property 
      ? document.querySelector(`meta[property="${property}"]`)
      : document.querySelector(`meta[name="${name}"]`);

    if (!element) {
      element = document.createElement('meta');
      if (property) element.setAttribute('property', property);
      if (name) element.setAttribute('name', name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Standard Meta Tags
  setMetaTag(null, 'description', description);

  // Open Graph Meta Tags (Used by WhatsApp, Facebook, iMessage, LinkedIn)
  setMetaTag('og:title', null, title);
  setMetaTag('og:description', null, description);
  setMetaTag('og:image', null, imageUrl);
  setMetaTag('og:url', null, url);
  setMetaTag('og:type', null, 'product');
  setMetaTag('og:site_name', null, 'MILIVA Skincare');

  // Twitter Card Meta Tags
  setMetaTag(null, 'twitter:card', 'summary_large_image');
  setMetaTag(null, 'twitter:title', title);
  setMetaTag(null, 'twitter:description', description);
  setMetaTag(null, 'twitter:image', imageUrl);
};
