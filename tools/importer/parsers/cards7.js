/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from a card li
  function getCardImage(card) {
    // Find the first <img> inside the card
    const img = card.querySelector('img');
    return img;
  }

  // Helper to extract the text content from a card li
  function getCardText(card) {
    // Find the content container
    const content = card.querySelector('.lp__list_navigation_content');
    if (!content) return null;
    // We'll collect the title, hammer, and blurb
    const frag = document.createDocumentFragment();

    // Title
    const titleDiv = content.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      // Use the <a> inside as the heading
      const a = titleDiv.querySelector('a');
      if (a) {
        // Wrap in <strong> for heading effect
        const strong = document.createElement('strong');
        strong.textContent = a.textContent.trim();
        frag.appendChild(strong);
      }
    }

    // Hammer (meta info)
    const hammerDiv = content.querySelector('.lp__hammer');
    if (hammerDiv) {
      // Add as a <div> below the heading
      const hammer = document.createElement('div');
      hammer.innerHTML = hammerDiv.innerHTML;
      frag.appendChild(hammer);
    }

    // Blurb (description)
    const blurbDiv = content.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Add the <p> as is
      const p = blurbDiv.querySelector('p');
      if (p) {
        frag.appendChild(p);
      }
    }

    return frag;
  }

  // Find all card items
  const cards = element.querySelectorAll('li.lp__list_navigation_section');
  const rows = [];
  // Header row as required
  const headerRow = ['Cards (cards7)'];
  rows.push(headerRow);

  cards.forEach((card) => {
    const img = getCardImage(card);
    const text = getCardText(card);
    // Defensive: only add row if both image and text exist
    if (img && text) {
      rows.push([img, text]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
