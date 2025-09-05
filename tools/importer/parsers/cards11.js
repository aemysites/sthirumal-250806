/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a card wrapper
  function extractCard(cardWrapper) {
    // Image: find <picture> or <img> inside .lp__card_img
    const imgContainer = cardWrapper.querySelector('.lp__card_img');
    let imageEl = null;
    if (imgContainer) {
      imageEl = imgContainer.querySelector('picture') || imgContainer.querySelector('img');
    }

    // Text content: title, description, CTA
    const contentContainer = cardWrapper.querySelector('.lp__card_content');
    const contentParts = [];
    if (contentContainer) {
      // Title
      const title = contentContainer.querySelector('.lp__card_title');
      if (title) contentParts.push(title);
      // Description
      const desc = contentContainer.querySelector('.lp__card_description');
      if (desc) contentParts.push(desc);
      // CTA (optional)
      const ctaList = contentContainer.querySelector('.lp__card_list');
      if (ctaList) contentParts.push(ctaList);
    }
    return [imageEl, contentParts];
  }

  // Find all card wrappers in the block
  // Defensive: find all .lp__card_wrapper inside element
  const cardWrappers = Array.from(element.querySelectorAll('.lp__card_wrapper'));

  // Table header
  const headerRow = ['Cards (cards11)'];
  const rows = [headerRow];

  // Each card: [image, text content]
  cardWrappers.forEach((cardWrapper) => {
    const [imageEl, contentParts] = extractCard(cardWrapper);
    rows.push([
      imageEl,
      contentParts
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
