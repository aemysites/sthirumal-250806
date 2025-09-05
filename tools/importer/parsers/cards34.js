/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the list of cards
  const cardsList = element.querySelector('.lp__list_navcomponents ul');
  if (!cardsList) return;

  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];

  // Each card is a <li class="lp__list_navigation_section">
  cardsList.querySelectorAll(':scope > li.lp__list_navigation_section').forEach((li) => {
    // Image: find <img> inside .lp__lg_horizontal_img
    const imgContainer = li.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
      // Fix any accidental spaces in src attributes
      if (imgEl && imgEl.src) {
        imgEl.src = imgEl.src.replace(/\s+(?=\.[a-zA-Z]{3,4}$)/, '');
      }
      if (imgEl && imgEl.getAttribute('data-src')) {
        imgEl.setAttribute('data-src', imgEl.getAttribute('data-src').replace(/\s+(?=\.[a-zA-Z]{3,4}$)/, ''));
      }
    }

    // Text cell: title, hammer, blurb, CTA
    const contentContainer = li.querySelector('.lp__list_navigation_content');
    const textCellContent = [];

    // Title (as heading)
    const titleDiv = contentContainer && contentContainer.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      // Use the <a> inside as heading
      const titleLink = titleDiv.querySelector('a');
      if (titleLink) {
        // Make a heading element
        const heading = document.createElement('h3');
        heading.appendChild(titleLink);
        textCellContent.push(heading);
      }
    }

    // Hammer (subtitle)
    const hammerDiv = contentContainer && contentContainer.querySelector('.lp__hammer');
    if (hammerDiv) {
      const subtitle = document.createElement('p');
      subtitle.innerHTML = hammerDiv.innerHTML;
      textCellContent.push(subtitle);
    }

    // Blurb (description)
    const blurbDiv = contentContainer && contentContainer.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      const blurbP = blurbDiv.querySelector('p');
      if (blurbP) {
        textCellContent.push(blurbP);
      }
    }

    // CTA: use the overlay link (not the title link)
    const overlayLink = li.querySelector('a.lp__overlay-link');
    if (overlayLink) {
      const cta = document.createElement('p');
      const ctaLink = document.createElement('a');
      ctaLink.href = overlayLink.href;
      ctaLink.textContent = overlayLink.textContent;
      cta.appendChild(ctaLink);
      textCellContent.push(cta);
    }

    // Compose row: [image, text content]
    rows.push([
      imgEl,
      textCellContent
    ]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
