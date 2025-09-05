/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from a card
  function getCardImage(card) {
    const imgWrapper = card.querySelector('.lp-aca-card-img');
    if (!imgWrapper) return null;
    // Prefer <img> inside <picture>
    const img = imgWrapper.querySelector('img');
    if (img) return img;
    // Fallback: use <picture> itself
    const picture = imgWrapper.querySelector('picture');
    if (picture) return picture;
    return null;
  }

  // Helper to extract the text content from a card
  function getCardText(card) {
    const content = card.querySelector('.lp-aca-card-content');
    if (!content) return null;
    // Compose a fragment for the text cell
    const frag = document.createDocumentFragment();
    // Title (h3 > a)
    const title = content.querySelector('.lp-aca-card-title');
    if (title) frag.appendChild(title.cloneNode(true));
    // Description
    const desc = content.querySelector('.lp-aca-card-description');
    if (desc) frag.appendChild(desc.cloneNode(true));
    // CTA(s)
    // Some cards have a single <a>, some have <ul><li><a></a></li></ul>
    // Get all links inside content that are visible CTAs
    const ctas = [];
    // Direct child link (not using "> a.lp-aca-card-link" which is invalid)
    Array.from(content.children).forEach(child => {
      if (child.matches && child.matches('a.lp-aca-card-link')) {
        ctas.push(child.cloneNode(true));
      }
    });
    // Links inside <ul>
    const ulLinks = content.querySelectorAll('ul li a.lp-aca-card-link');
    ulLinks.forEach(a => ctas.push(a.cloneNode(true)));
    if (ctas.length) {
      // If multiple CTAs, put them in a container (e.g. div)
      const ctaContainer = document.createElement('div');
      ctas.forEach(a => ctaContainer.appendChild(a));
      frag.appendChild(ctaContainer);
    }
    return frag;
  }

  // Find all cards in the block
  const cards = element.querySelectorAll('.lp-aca-card');
  const rows = [];
  // Header row
  rows.push(['Cards (cards28)']);
  // Card rows
  cards.forEach(card => {
    const img = getCardImage(card);
    const text = getCardText(card);
    rows.push([img, text]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
