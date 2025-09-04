/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the card list container
  const listNav = element.querySelector('.lp__list_navcomponents > ul');
  if (!listNav) return;

  // Header row as required
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];

  // Each card is a <li class="lp__list_navigation_section">
  const cards = listNav.querySelectorAll(':scope > li.lp__list_navigation_section');
  cards.forEach((card) => {
    // --- IMAGE CELL ---
    // Find the <img> inside the .lp__lg_horizontal_img
    const imgContainer = card.querySelector('.lp__lg_horizontal_img');
    let imageEl = null;
    if (imgContainer) {
      imageEl = imgContainer.querySelector('img');
    }

    // --- TEXT CELL ---
    // We'll build a fragment for the text cell
    const textFrag = document.createDocumentFragment();

    // Title (as heading, with link if present)
    const titleDiv = card.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      // Use <strong> for heading style, wrap link if present
      const link = titleDiv.querySelector('a');
      if (link) {
        const strong = document.createElement('strong');
        strong.appendChild(link);
        textFrag.appendChild(strong);
      } else {
        // fallback: just text
        const strong = document.createElement('strong');
        strong.textContent = titleDiv.textContent.trim();
        textFrag.appendChild(strong);
      }
    }

    // Hammer (subtitle)
    const hammerDiv = card.querySelector('.lp__hammer');
    if (hammerDiv) {
      // Add as a <div> below the heading
      const hammerClone = document.createElement('div');
      hammerClone.textContent = hammerDiv.textContent.trim();
      hammerClone.style.fontWeight = 'bold';
      hammerClone.style.fontSize = 'smaller';
      textFrag.appendChild(hammerClone);
    }

    // Description (blurb)
    const blurbDiv = card.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Use the <p> as-is if present
      const p = blurbDiv.querySelector('p');
      if (p) {
        textFrag.appendChild(p);
      } else {
        // fallback: add the div's text
        const desc = document.createElement('p');
        desc.textContent = blurbDiv.textContent.trim();
        textFrag.appendChild(desc);
      }
    }

    // CTA: If there is a visible link (not aria-hidden overlay), add at bottom
    // Use the first <a> in the titleDiv (already included), so skip unless there is a unique CTA
    // (In this HTML, there is no separate CTA, so nothing to add)

    // Add row: [image, text]
    rows.push([
      imageEl,
      textFrag
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
