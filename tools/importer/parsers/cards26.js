/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract each card block
  function getCards(container) {
    // Defensive: find all card wrappers in the block
    return Array.from(container.querySelectorAll('.lp__card_wrapper'));
  }

  // Find the deepest container holding all cards
  // Defensive: look for .row > .col-md-4 > ... > .lp__card_wrapper
  let cardsParent = null;
  const rows = element.querySelectorAll(':scope .row');
  for (const row of rows) {
    const cols = row.querySelectorAll(':scope > .col-md-4');
    if (cols.length > 0) {
      cardsParent = row;
      break;
    }
  }
  if (!cardsParent) return;

  // Build table rows
  const headerRow = ['Cards (cards26)'];
  const rowsArr = [headerRow];

  // For each card, extract image and text content
  const cardCols = cardsParent.querySelectorAll(':scope > .col-md-4');
  cardCols.forEach((col) => {
    const cardWrapper = col.querySelector('.lp__card_wrapper');
    if (!cardWrapper) return;

    // Image cell: find <picture> or <img> inside .lp__card_img
    let imgCell = null;
    const imgDiv = cardWrapper.querySelector('.lp__card_img');
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // Text cell: title, description, CTA
    const contentDiv = cardWrapper.querySelector('.lp__card_content');
    const textCellContent = [];
    if (contentDiv) {
      // Title (h3 or a)
      const title = contentDiv.querySelector('.lp__card_title');
      if (title) {
        textCellContent.push(title);
      }
      // Description
      const desc = contentDiv.querySelector('.lp__card_description');
      if (desc) {
        textCellContent.push(desc);
      }
    }
    // CTA: overlay link (if present)
    const overlayLink = cardWrapper.querySelector('.lp__overlay-link');
    if (overlayLink) {
      textCellContent.push(overlayLink);
    }

    // Defensive: only add row if image and text exist
    if (imgCell && textCellContent.length) {
      rowsArr.push([imgCell, textCellContent]);
    }
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rowsArr, document);
  element.replaceWith(table);
}
