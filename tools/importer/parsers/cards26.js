/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (as <img>) from a card
  function extractImage(card) {
    // Find the picture element inside the card
    const picture = card.querySelector('.lp-aca-card-img picture');
    if (picture) {
      // Find the first <img> inside <picture>
      const img = picture.querySelector('img');
      if (img) return img;
    }
    return null;
  }

  // Helper to extract the text content (title, description, tag, link)
  function extractTextContent(card) {
    const content = document.createElement('div');
    // Tag (optional, usually above title)
    const tag = card.querySelector('.lp-aca-card-tag');
    if (tag) {
      // Use a <p> for tag for clarity
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent;
      content.appendChild(tagP);
    }
    // Title (mandatory, usually <h3> with <a>)
    const title = card.querySelector('.lp-aca-card-title');
    if (title) {
      // Clone the <h3> (with link inside)
      content.appendChild(title.cloneNode(true));
    }
    // Description (optional)
    const desc = card.querySelector('.lp-aca-card-description');
    if (desc) {
      // Use a <p> for description
      const descP = document.createElement('p');
      descP.textContent = desc.textContent;
      content.appendChild(descP);
    }
    return content;
  }

  // Find all cards (li.swiper-slide)
  const cards = Array.from(element.querySelectorAll(':scope > li'));

  // Build the table rows
  const rows = [];
  // Header row as required
  rows.push(['Cards (cards26)']);

  cards.forEach((li) => {
    const card = li.querySelector('.lp-aca-card');
    if (!card) return; // Defensive: skip if not found
    const img = extractImage(card);
    const textContent = extractTextContent(card);
    rows.push([
      img || '',
      textContent
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
