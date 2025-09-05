/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from a card
  function getCardImage(card) {
    // Find the first <img> inside the card
    const img = card.querySelector('img');
    return img || '';
  }

  // Helper to extract the text content from a card
  function getCardText(card) {
    const content = card.querySelector('.lp__list_navigation_content');
    if (!content) return '';
    const parts = [];

    // Title (as heading, strong)
    const titleDiv = content.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      const link = titleDiv.querySelector('a');
      if (link) {
        const strong = document.createElement('strong');
        strong.append(link.textContent);
        parts.push(strong);
      }
    }

    // Hammer (meta info)
    const hammerDiv = content.querySelector('.lp__hammer');
    if (hammerDiv && hammerDiv.textContent.trim()) {
      const hammer = document.createElement('div');
      hammer.textContent = hammerDiv.textContent.trim();
      parts.push(hammer);
    }

    // Blurb (description)
    const blurbDiv = content.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      const p = blurbDiv.querySelector('p');
      if (p && p.textContent.trim()) {
        const para = document.createElement('p');
        para.textContent = p.textContent.trim();
        parts.push(para);
      }
    }

    return parts.length ? parts : '';
  }

  // Find all cards
  const cards = Array.from(element.querySelectorAll('.lp__list_navigation_section'));

  // Build table rows
  const rows = [];
  rows.push(['Cards (cards29)']);

  cards.forEach(card => {
    const img = getCardImage(card);
    const textParts = getCardText(card);
    rows.push([
      img,
      textParts
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
