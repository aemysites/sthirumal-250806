/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the list of cards
  const listNav = element.querySelector('.lp__list_navcomponents ul');
  if (!listNav) return;

  // Table header
  const headerRow = ['Cards (cards16)'];
  const rows = [headerRow];

  // Each card is a li.lp__list_navigation_section
  const cards = listNav.querySelectorAll(':scope > li.lp__list_navigation_section');
  cards.forEach(card => {
    // Image cell: find the <img> inside .lp__lg_horizontal_img
    const imgWrap = card.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgWrap) {
      imgEl = imgWrap.querySelector('img');
    }

    // Text cell: build a fragment with title, hammer, description, and CTA
    const contentWrap = card.querySelector('.lp__list_navigation_content');
    const frag = document.createElement('div');

    // Title (as heading)
    const titleDiv = contentWrap && contentWrap.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      // Use the <a> as the heading, but keep link
      const titleLink = titleDiv.querySelector('a');
      if (titleLink) {
        const heading = document.createElement('h3');
        heading.appendChild(titleLink);
        frag.appendChild(heading);
      }
    }

    // Hammer (subtitle)
    const hammerDiv = contentWrap && contentWrap.querySelector('.lp__hammer');
    if (hammerDiv) {
      const hammer = document.createElement('div');
      hammer.innerHTML = hammerDiv.innerHTML;
      hammer.style.fontWeight = 'bold';
      hammer.style.fontSize = '0.95em';
      frag.appendChild(hammer);
    }

    // Description
    const blurbDiv = contentWrap && contentWrap.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Use the <p> directly
      const descP = blurbDiv.querySelector('p');
      if (descP) {
        frag.appendChild(descP);
      }
    }

    // CTA: Use the overlay link (not the heading link)
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if href is present and not duplicate of heading link
      // (But in this HTML, it's always the same as heading link, so skip to avoid duplicate)
      // If you want to always show CTA, uncomment below:
      // const cta = document.createElement('div');
      // cta.appendChild(overlayLink);
      // frag.appendChild(cta);
    }

    // Add row: [image, text]
    rows.push([imgEl, frag]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
