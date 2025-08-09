/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row for the Accordion block
  const cells = [['Accordion']];

  // Select all immediate accordion items (direct children)
  const accordionItems = element.querySelectorAll(':scope > .accordion');
  accordionItems.forEach((item) => {
    // Title cell: Find the dropdown toggle, and then the title inside
    const toggle = item.querySelector('.w-dropdown-toggle');
    let titleElem = null;
    if (toggle) {
      // The readable title is usually inside .paragraph-lg
      titleElem = toggle.querySelector('.paragraph-lg') || toggle;
    }

    // Content cell: Find the accordion content
    const content = item.querySelector('.accordion-content');
    let contentElem = null;
    if (content) {
      // The rich text is typically inside .rich-text/.w-richtext
      contentElem = content.querySelector('.rich-text, .w-richtext') || content;
    }

    // Push only if there's a title and content
    if (titleElem && contentElem) {
      cells.push([titleElem, contentElem]);
    }
  });

  // Create the table and replace the original element
  if (cells.length > 1) { // Only replace if we have at least one accordion item
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
