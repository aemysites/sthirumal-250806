/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find all card root elements
  function getCardElements(root) {
    // Find all .lp__card under the element
    return Array.from(root.querySelectorAll('.lp__card'));
  }

  // Helper to extract image (picture or img) from card
  function extractImage(card) {
    // Prefer the <picture> element if present
    const pic = card.querySelector('.lp__card_img picture');
    if (pic) return pic;
    // Fallback to img
    const img = card.querySelector('.lp__card_img img');
    if (img) return img;
    return null;
  }

  // Helper to extract text content (title, description, CTA) from card
  function extractTextContent(card) {
    const contentDiv = card.querySelector('.lp__card_content');
    if (!contentDiv) return document.createElement('div');
    // Clone the contentDiv to avoid moving it out of the DOM
    const contentClone = contentDiv.cloneNode(true);
    // Remove id attributes (if any)
    contentClone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    return contentClone;
  }

  // Compose the table rows
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Find all cards
  const cards = getCardElements(element);

  cards.forEach(card => {
    // Image cell
    const imageEl = extractImage(card);
    // Text cell
    const textEl = extractTextContent(card);
    rows.push([
      imageEl,
      textEl
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
