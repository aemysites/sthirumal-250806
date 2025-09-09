/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all card root elements
  function getCardElements(root) {
    // The cards are inside .lp__card
    return Array.from(root.querySelectorAll('.lp__card'));
  }

  // Helper to extract image (picture or img) from card
  function getCardImage(card) {
    // Prefer <picture> if present, else <img>
    const pic = card.querySelector('.lp__card_img picture');
    if (pic) return pic;
    const img = card.querySelector('.lp__card_img img');
    if (img) return img;
    return null;
  }

  // Helper to extract text content (title, description, cta) from card
  function getCardTextContent(card) {
    const contentDiv = card.querySelector('.lp__card_content');
    if (!contentDiv) return '';
    // We'll collect: heading, description
    const nodes = [];
    // Heading
    const h3 = contentDiv.querySelector('.lp__card_title');
    if (h3) nodes.push(h3);
    // Description
    const desc = contentDiv.querySelector('.lp__card_description');
    if (desc) nodes.push(desc);
    return nodes;
  }

  // Find the card columns in the block
  const cards = getCardElements(element);

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards12)']);

  // For each card, build a row: [image, text content]
  cards.forEach((card) => {
    const img = getCardImage(card);
    const textContent = getCardTextContent(card);
    rows.push([
      img,
      textContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
