/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists
  if (!element) return;

  // Header row for the block table
  const headerRow = ['Hero (hero23)'];

  // --- Row 2: Background Image (optional) ---
  // Try to extract any background image from the color-wrapper div
  let bgCell = '';
  const colorWrapper = element.querySelector('.color-wrapper');
  if (colorWrapper) {
    // If there is a background image style, extract it
    const bgImage = colorWrapper.style.backgroundImage;
    if (bgImage && bgImage !== 'none') {
      // Extract the URL from backgroundImage style
      const urlMatch = bgImage.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        const img = document.createElement('img');
        img.src = urlMatch[1];
        bgCell = img;
      }
    } else {
      // If no image, include the color-wrapper div itself for visual reference
      bgCell = colorWrapper.cloneNode(true);
    }
  }

  // --- Row 3: Headline, Subheading, CTA (all optional) ---
  // There is no headline, subheading, or CTA in this HTML block.
  // But to meet requirements, include any text content from the color-wrapper or its children
  let contentCell = '';
  if (colorWrapper) {
    // Collect all text nodes inside colorWrapper
    const textContent = colorWrapper.textContent.trim();
    if (textContent) {
      contentCell = textContent;
    }
  }

  // Compose the table rows
  const cells = [headerRow, [bgCell], [contentCell]];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
