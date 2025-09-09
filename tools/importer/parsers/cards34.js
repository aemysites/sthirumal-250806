/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the list of cards
  const cardsList = element.querySelector('ul');
  if (!cardsList) return;

  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];

  // Each card is a <li class="lp__list_navigation_section">
  cardsList.querySelectorAll(':scope > li.lp__list_navigation_section').forEach((li) => {
    // Image cell: find <picture> or <img>
    let imageCell = null;
    const imgContainer = li.querySelector('.lp__lg_horizontal_img');
    if (imgContainer) {
      // Prefer <picture> if present, else <img>
      const picture = imgContainer.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imgContainer.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Text cell: title, hammer, blurb, CTA
    const contentContainer = li.querySelector('.lp__list_navigation_content');
    const textCellContent = [];
    if (contentContainer) {
      // Title (as heading)
      const titleDiv = contentContainer.querySelector('.lp__list_navigation_title');
      if (titleDiv) {
        // Use <a> inside titleDiv, wrap in <strong> for heading effect
        const a = titleDiv.querySelector('a');
        if (a) {
          const strong = document.createElement('strong');
          strong.appendChild(a);
          textCellContent.push(strong);
        }
      }
      // Hammer (subtitle)
      const hammerDiv = contentContainer.querySelector('.lp__hammer');
      if (hammerDiv) {
        // Use <em> for subtitle effect
        const em = document.createElement('em');
        em.innerHTML = hammerDiv.innerHTML;
        textCellContent.push(em);
      }
      // Blurb (description)
      const blurbDiv = contentContainer.querySelector('.lp__blurb_text');
      if (blurbDiv) {
        // Use the <p> inside blurbDiv
        const p = blurbDiv.querySelector('p');
        if (p) textCellContent.push(p);
      }
      // CTA: use overlay link if present and not already used
      const overlayLink = li.querySelector('a.lp__overlay-link');
      if (overlayLink) {
        // Only add if not already present in title
        if (!titleDiv || !titleDiv.contains(overlayLink)) {
          const ctaLink = document.createElement('a');
          ctaLink.href = overlayLink.href;
          ctaLink.textContent = overlayLink.textContent;
          textCellContent.push(ctaLink);
        }
      }
    }

    // Defensive: if no image, fallback to null
    rows.push([
      imageCell || '',
      textCellContent.length > 1 ? textCellContent : textCellContent[0] || ''
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
