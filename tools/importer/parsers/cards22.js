/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate card elements
  const cards = element.querySelectorAll('.lp__list_navigation_section');

  // Table header as per spec
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  cards.forEach((card) => {
    // Image cell: find the <img> inside the picture
    const imgContainer = card.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }

    // Text cell: collect title, hammer, blurb, and CTA if present
    const contentContainer = card.querySelector('.lp__list_navigation_content');
    const textContent = document.createElement('div');
    if (contentContainer) {
      // Title (as heading)
      const titleDiv = contentContainer.querySelector('.lp__list_navigation_title');
      if (titleDiv) {
        // Use the <a> inside as the heading
        const titleLink = titleDiv.querySelector('a');
        if (titleLink) {
          const heading = document.createElement('strong');
          heading.appendChild(titleLink.cloneNode(true));
          textContent.appendChild(heading);
        }
      }
      // Hammer (meta info)
      const hammerDiv = contentContainer.querySelector('.lp__hammer');
      if (hammerDiv) {
        const meta = document.createElement('div');
        meta.innerHTML = hammerDiv.innerHTML;
        meta.style.fontWeight = 'bold';
        meta.style.fontSize = '0.95em';
        textContent.appendChild(document.createElement('br'));
        textContent.appendChild(meta);
      }
      // Blurb (description)
      const blurbDiv = contentContainer.querySelector('.lp__blurb_text');
      if (blurbDiv) {
        // Add a line break if there's already content
        if (textContent.childNodes.length > 0) {
          textContent.appendChild(document.createElement('br'));
        }
        // Add all children (usually <p>)
        Array.from(blurbDiv.childNodes).forEach((node) => {
          textContent.appendChild(node.cloneNode(true));
        });
      }
    }
    // CTA: use the overlay link if present
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if not already present in title
      const cta = document.createElement('div');
      const ctaLink = overlayLink.cloneNode(true);
      cta.appendChild(ctaLink);
      textContent.appendChild(cta);
    }

    // Compose row: [image, text]
    rows.push([
      imgEl,
      textContent
    ]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
