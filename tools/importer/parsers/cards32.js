/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first <img> from a <picture> element
  function getImageFromPicture(picture) {
    if (!picture) return null;
    return picture.querySelector('img');
  }

  // Helper to build the text cell for a card
  function buildTextCell(contentDiv) {
    const fragments = [];
    if (!contentDiv) return fragments;
    // Title (as heading)
    const titleDiv = contentDiv.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      // Use the <a> as heading
      const a = titleDiv.querySelector('a');
      if (a) {
        const h3 = document.createElement('h3');
        h3.appendChild(a);
        fragments.push(h3);
      }
    }
    // Hammer (subheading/category)
    const hammerDiv = contentDiv.querySelector('.lp__hammer');
    if (hammerDiv) {
      // Use a <p> for the hammer/category line
      const p = document.createElement('p');
      p.innerHTML = hammerDiv.innerHTML;
      fragments.push(p);
    }
    // Description
    const blurbDiv = contentDiv.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Use the <p> inside blurbDiv
      const p = blurbDiv.querySelector('p');
      if (p) {
        fragments.push(p);
      }
    }
    // CTA (link at the bottom)
    // Try to find a link in the titleDiv, otherwise look for overlay-link
    let ctaLink = null;
    if (titleDiv) {
      ctaLink = titleDiv.querySelector('a');
    }
    if (!ctaLink) {
      // Fallback: find .lp__overlay-link sibling
      const overlayLink = contentDiv.parentElement.querySelector('.lp__overlay-link');
      if (overlayLink) {
        // Only add if not already present
        ctaLink = overlayLink;
      }
    }
    // Only add CTA if it's not already included in the heading
    if (ctaLink && (!fragments.length || !fragments[0].contains(ctaLink))) {
      const p = document.createElement('p');
      p.appendChild(ctaLink);
      fragments.push(p);
    }
    return fragments;
  }

  // Find all cards
  const cards = [];
  // The cards are <li class="lp__list_navigation_section">
  const cardEls = element.querySelectorAll('.lp__list_navcomponents > ul > li.lp__list_navigation_section');
  cardEls.forEach((li) => {
    // Image cell
    const imgDiv = li.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      imgEl = getImageFromPicture(picture);
    }
    // Text cell
    const contentDiv = li.querySelector('.lp__list_navigation_content');
    const textCell = buildTextCell(contentDiv);
    // Only add if both image and text exist
    if (imgEl && textCell.length > 0) {
      cards.push([imgEl, textCell]);
    }
  });

  // Build the table rows
  const rows = [
    ['Cards (cards32)'],
    ...cards
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
