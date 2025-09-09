/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct card elements
  function getCardElements(root) {
    // Find all columns that contain cards
    return Array.from(root.querySelectorAll('.colsplit'));
  }

  // Helper to extract card data from a column
  function extractCard(col) {
    // Defensive: find the card wrapper
    const cardWrapper = col.querySelector('.lp__card_wrapper');
    if (!cardWrapper) return null;

    // Image: find the <img> inside .lp__card_img
    let imgCell = null;
    const imgContainer = cardWrapper.querySelector('.lp__card_img');
    if (imgContainer) {
      const img = imgContainer.querySelector('img');
      if (img) imgCell = img;
    }

    // Text cell: title, description, CTA
    const contentContainer = cardWrapper.querySelector('.lp__card_content');
    const textParts = [];
    if (contentContainer) {
      // Title (h3 > a)
      const title = contentContainer.querySelector('.lp__card_title');
      if (title) textParts.push(title);
      // Description (div.lp__card_description)
      const desc = contentContainer.querySelector('.lp__card_description');
      if (desc) textParts.push(desc);
      // CTA (ul.lp__card_list > li > a)
      const ctaList = contentContainer.querySelector('.lp__card_list');
      if (ctaList) {
        // Only add the link(s), not the whole list
        const links = Array.from(ctaList.querySelectorAll('a'));
        if (links.length) textParts.push(...links);
      }
    }

    // Defensive: if nothing found, skip
    if (!imgCell && textParts.length === 0) return null;

    return [imgCell, textParts];
  }

  // Build table rows
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Get all card columns
  const cardCols = getCardElements(element);
  cardCols.forEach((col) => {
    const cardData = extractCard(col);
    if (cardData) {
      rows.push(cardData);
    }
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
