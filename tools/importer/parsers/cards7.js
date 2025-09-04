/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from a card li
  function getCardImage(card) {
    // Find the <img> inside the picture
    const img = card.querySelector('picture img');
    return img;
  }

  // Helper to extract the text content from a card li
  function getCardText(card) {
    // Find the content container
    const content = card.querySelector('.lp__list_navigation_content');
    if (!content) return null;
    // We'll collect the title, hammer, and blurb
    const title = content.querySelector('.lp__list_navigation_title');
    const hammer = content.querySelector('.lp__hammer');
    const blurb = content.querySelector('.lp__blurb_text');
    // Compose a fragment to hold all text content
    const frag = document.createElement('div');
    if (title) frag.appendChild(title);
    if (hammer) frag.appendChild(hammer);
    if (blurb) frag.appendChild(blurb);
    return frag;
  }

  // Find all cards
  const cards = element.querySelectorAll('li.lp__list_navigation_section');
  const rows = [];
  // Header row
  rows.push(['Cards (cards7)']);

  // Each card: [image, text]
  cards.forEach((card) => {
    const img = getCardImage(card);
    const text = getCardText(card);
    // Defensive: only add if both present
    if (img && text) {
      rows.push([img, text]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
