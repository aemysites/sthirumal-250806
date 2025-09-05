/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first <img> from a picture container
  function getImageFromPicture(picture) {
    if (!picture) return null;
    return picture.querySelector('img');
  }

  // Helper to build the text cell for a card
  function buildTextCell(contentDiv) {
    const parts = [];
    if (!contentDiv) return parts;
    // Title
    const titleDiv = contentDiv.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      // Use the <a> inside as the heading
      const link = titleDiv.querySelector('a');
      if (link) {
        // Make a heading element for semantics
        const heading = document.createElement('strong');
        heading.appendChild(link);
        parts.push(heading);
      }
    }
    // Hammer (subtitle)
    const hammerDiv = contentDiv.querySelector('.lp__hammer');
    if (hammerDiv) {
      // Use <div> as is (already styled)
      parts.push(hammerDiv);
    }
    // Blurb (description)
    const blurbDiv = contentDiv.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Use the <p> as is
      parts.push(...blurbDiv.childNodes);
    }
    return parts;
  }

  // Find all card items
  const cards = Array.from(element.querySelectorAll('.lp__list_navigation_section'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards18)']);

  // Card rows
  cards.forEach((card) => {
    // Image cell
    const imgDiv = card.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      imgEl = getImageFromPicture(picture);
    }
    // Text cell
    const contentDiv = card.querySelector('.lp__list_navigation_content');
    const textCell = buildTextCell(contentDiv);
    // Only add row if both image and text exist
    if (imgEl && textCell.length > 0) {
      rows.push([
        imgEl,
        textCell
      ]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
