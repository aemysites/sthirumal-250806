/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards37)'];
  const rows = [headerRow];

  // Find all card list items
  const cardEls = element.querySelectorAll('.lp__list_navigation_section');

  cardEls.forEach((cardEl) => {
    // Image cell: find the <img> inside the .lp__lg_horizontal_img
    const imgContainer = cardEl.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }

    // Text cell: build a fragment with title, hammer, blurb, and CTA
    const contentContainer = cardEl.querySelector('.lp__list_navigation_content');
    const frag = document.createElement('div');
    if (contentContainer) {
      // Title (as heading)
      const titleDiv = contentContainer.querySelector('.lp__list_navigation_title');
      if (titleDiv) {
        // Use <strong> for heading style
        const titleLink = titleDiv.querySelector('a');
        if (titleLink) {
          const strong = document.createElement('strong');
          strong.appendChild(titleLink);
          frag.appendChild(strong);
        }
      }
      // Hammer (subtitle)
      const hammerDiv = contentContainer.querySelector('.lp__hammer');
      if (hammerDiv) {
        const hammer = document.createElement('div');
        hammer.innerHTML = hammerDiv.innerHTML;
        hammer.style.fontSize = 'smaller';
        hammer.style.fontWeight = 'bold';
        frag.appendChild(hammer);
      }
      // Blurb (description)
      const blurbDiv = contentContainer.querySelector('.lp__blurb_text');
      if (blurbDiv) {
        // Use the <p> directly
        const p = blurbDiv.querySelector('p');
        if (p) frag.appendChild(p);
      }
    }
    // CTA: use the .lp__overlay-link (hidden link) if present and not already used
    const overlayLink = cardEl.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if not already present in title
      const titleLink = contentContainer && contentContainer.querySelector('.lp__list_navigation_title a');
      if (!titleLink || (titleLink && titleLink.getAttribute('href') !== overlayLink.getAttribute('href'))) {
        const cta = document.createElement('div');
        const link = document.createElement('a');
        link.href = overlayLink.getAttribute('href');
        link.textContent = overlayLink.textContent;
        cta.appendChild(link);
        frag.appendChild(cta);
      }
    }
    // Add row: [image, text fragment]
    rows.push([imgEl, frag]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
