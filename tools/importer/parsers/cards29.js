/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (picture or img) from a card
  function extractImage(card) {
    // Prefer picture if present, else img
    const pic = card.querySelector('.lp-aca-card-img picture');
    if (pic) return pic;
    const img = card.querySelector('.lp-aca-card-img img');
    if (img) return img;
    return null;
  }

  // Helper to extract the tag (e.g., "New for 2025") if present
  function extractTag(card) {
    const tag = card.querySelector('.lp-aca-card-tag');
    return tag ? tag : null;
  }

  // Helper to extract the content (title, desc, cta)
  function extractContent(card) {
    const contentDiv = card.querySelector('.lp-aca-card-content');
    if (!contentDiv) return null;
    const content = [];
    // Title (h3 with link)
    const title = contentDiv.querySelector('.lp-aca-card-title');
    if (title) content.push(title);
    // Description
    const desc = contentDiv.querySelector('.lp-aca-card-description');
    if (desc) content.push(desc);
    // CTA(s)
    // There may be multiple links (e.g., in a ul), or a single link
    const links = Array.from(contentDiv.querySelectorAll('.lp-aca-card-link'));
    if (links.length > 0) {
      // If links are in a ul/li, group them in a div for layout
      const parentUl = contentDiv.querySelector('ul');
      if (parentUl) {
        // Wrap all links in a div
        const ctaDiv = document.createElement('div');
        links.forEach(link => {
          ctaDiv.appendChild(link);
        });
        content.push(ctaDiv);
      } else {
        // Just add the single link
        content.push(links[0]);
      }
    }
    return content;
  }

  // Find all cards in the section
  const cards = Array.from(element.querySelectorAll('.lp-aca-card'));

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards29)']);

  // For each card, build a row: [image+tag, content]
  cards.forEach(card => {
    // Image cell: picture (or img), plus tag if present
    const img = extractImage(card);
    const tag = extractTag(card);
    const imgCell = [];
    if (img) imgCell.push(img);
    if (tag) imgCell.push(tag);
    // Content cell: title, desc, cta(s)
    const content = extractContent(card);
    rows.push([
      imgCell.length === 1 ? imgCell[0] : imgCell, // single element or array
      content && content.length === 1 ? content[0] : content // single element or array
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
