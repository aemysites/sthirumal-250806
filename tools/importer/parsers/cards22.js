/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the <img> from a <picture>
  function getImageFromPicture(picture) {
    if (!picture) return null;
    return picture.querySelector('img');
  }

  // Helper to build the text cell for a card
  function buildTextCell(contentDiv) {
    const frag = document.createDocumentFragment();
    if (!contentDiv) return frag;

    // Title (as heading)
    const titleDiv = contentDiv.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      // Use the <a> inside as the heading
      const link = titleDiv.querySelector('a');
      if (link) {
        const h3 = document.createElement('h3');
        // Move the <a> into the heading
        h3.appendChild(link);
        frag.appendChild(h3);
      }
    }

    // Subtitle/Meta (lp__hammer)
    const hammerDiv = contentDiv.querySelector('.lp__hammer');
    if (hammerDiv) {
      // Use <p> for meta
      const meta = document.createElement('p');
      meta.innerHTML = hammerDiv.innerHTML;
      meta.style.fontWeight = 'bold';
      frag.appendChild(meta);
    }

    // Description (lp__blurb_text)
    const blurbDiv = contentDiv.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Move all children (usually <p>)
      Array.from(blurbDiv.childNodes).forEach((node) => {
        frag.appendChild(node);
      });
    }

    // CTA: If the title <a> exists, it's already in the heading. If not, look for overlay link
    // (But in this HTML, the overlay link is redundant with the title link)
    // So, skip duplicate CTA.
    return frag;
  }

  // Find all cards
  const cards = Array.from(element.querySelectorAll('.lp__list_navigation_section'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards22)']);

  // Each card row
  cards.forEach((card) => {
    // Image cell
    const imgDiv = card.querySelector('.lp__lg_horizontal_img');
    let image = null;
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      image = getImageFromPicture(picture);
    }
    // Text cell
    const contentDiv = card.querySelector('.lp__list_navigation_content');
    const textCell = buildTextCell(contentDiv);
    // Add row: [image, text]
    rows.push([
      image || '',
      textCell
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
