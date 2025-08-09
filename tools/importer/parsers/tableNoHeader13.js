/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Table (no header)'];
  const rows = [];

  // Find all direct children that are .divider elements
  const dividerEls = element.querySelectorAll(':scope > .divider');
  dividerEls.forEach((divider) => {
    // Each divider contains a .w-layout-grid (the row)
    const grid = divider.querySelector('.w-layout-grid');
    if (grid) {
      // Each grid has two children: question (heading) and answer (rich text)
      const [heading, answer] = grid.children;
      if (heading && answer) {
        rows.push([heading, answer]);
      } else {
        // fallback: use the grid as a single cell if unexpected
        rows.push([grid]);
      }
    } else {
      // fallback: use the divider itself as a single cell if unexpected
      rows.push([divider]);
    }
  });

  // If no rows found, maybe the structure is different: look for .w-layout-grid directly
  if (rows.length === 0) {
    const grids = element.querySelectorAll(':scope > .w-layout-grid');
    grids.forEach((grid) => {
      const [heading, answer] = grid.children;
      if (heading && answer) {
        rows.push([heading, answer]);
      } else {
        rows.push([grid]);
      }
    });
  }

  // Only build table if we have at least one data row
  if (rows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows,
    ], document);
    element.replaceWith(table);
  }
}
