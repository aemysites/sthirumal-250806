/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from a card
  function getImage(card) {
    const imgWrapper = card.querySelector('.lp-aca-card-img');
    if (!imgWrapper) return null;
    // Use the <img> inside <picture>
    const img = imgWrapper.querySelector('img');
    return img || null;
  }

  // Helper to extract the tag (e.g., "New for 2025") if present
  function getTag(card) {
    const tag = card.querySelector('.lp-aca-card-tag');
    return tag ? tag.cloneNode(true) : null;
  }

  // Helper to extract the text content from a card
  function getTextContent(card) {
    const content = card.querySelector('.lp-aca-card-content');
    if (!content) return null;
    const parts = [];
    // Title (h3 > a)
    const title = content.querySelector('.lp-aca-card-title');
    if (title) {
      // Use the heading element directly
      parts.push(title);
    }
    // Description
    const desc = content.querySelector('.lp-aca-card-description');
    if (desc) {
      parts.push(desc);
    }
    // CTA(s)
    // Some cards have a single link, some have a <ul> with multiple links
    // Collect all links with class 'lp-aca-card-link' inside content
    const links = Array.from(content.querySelectorAll('.lp-aca-card-link'));
    if (links.length > 0) {
      // If multiple links, group them in a <div> for clarity
      if (links.length === 1) {
        parts.push(links[0]);
      } else {
        const linkDiv = document.createElement('div');
        links.forEach((link, idx) => {
          linkDiv.appendChild(link);
          if (idx < links.length - 1) {
            // Add space between links
            linkDiv.appendChild(document.createTextNode(' '));
          }
        });
        parts.push(linkDiv);
      }
    }
    return parts;
  }

  // Find all cards in the block
  // Defensive: cards may be nested in columns
  const cardNodes = Array.from(element.querySelectorAll('.lp-aca-card'));

  // Build table rows
  const headerRow = ['Cards (cards28)'];
  const rows = [headerRow];

  cardNodes.forEach((card) => {
    // First cell: image (with optional tag)
    const img = getImage(card);
    const tag = getTag(card);
    const imgCell = [];
    if (img) imgCell.push(img);
    if (tag) imgCell.push(tag);
    // Second cell: text content (title, desc, cta)
    const textParts = getTextContent(card);
    rows.push([
      imgCell.length === 1 ? imgCell[0] : imgCell, // If only one, pass element; else array
      textParts.length === 1 ? textParts[0] : textParts // If only one, pass element; else array
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
