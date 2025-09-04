/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the card list container
  const listNav = element.querySelector('.lp__list_navcomponents');
  if (!listNav) return;

  // Get all card items
  const cardItems = Array.from(listNav.querySelectorAll('li.lp__list_navigation_section'));
  if (!cardItems.length) return;

  // Header row
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];

  cardItems.forEach((card) => {
    // Image cell: find <picture> or <img>
    let imageCell = null;
    const imgWrap = card.querySelector('.lp__lg_horizontal_img');
    if (imgWrap) {
      const picture = imgWrap.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imgWrap.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Text cell: title, hammer, description, CTA
    const contentWrap = card.querySelector('.lp__list_navigation_content');
    const textCellContent = [];
    if (contentWrap) {
      // Title (as heading)
      const titleDiv = contentWrap.querySelector('.lp__list_navigation_title');
      if (titleDiv) {
        // Use the <a> inside as heading
        const link = titleDiv.querySelector('a');
        if (link) {
          const heading = document.createElement('strong');
          heading.appendChild(link);
          textCellContent.push(heading);
        }
      }
      // Hammer (subtitle)
      const hammerDiv = contentWrap.querySelector('.lp__hammer');
      if (hammerDiv) {
        // Use as a paragraph (subtitle)
        const subtitle = document.createElement('div');
        subtitle.innerHTML = hammerDiv.innerHTML;
        textCellContent.push(subtitle);
      }
      // Description
      const blurbDiv = contentWrap.querySelector('.lp__blurb_text');
      if (blurbDiv) {
        textCellContent.push(blurbDiv);
      }
    }
    // CTA: Use the overlay link if present and not already used
    const overlayLink = card.querySelector('a.lp__overlay-link');
    if (overlayLink) {
      // Only add if not already present in title
      if (!textCellContent.some(el => el.contains && el.contains(overlayLink))) {
        textCellContent.push(overlayLink);
      }
    }

    // Compose row: [image, text]
    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
