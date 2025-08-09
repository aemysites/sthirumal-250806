/* global WebImporter */
export default function parse(element, { document }) {
  // Get tab menu and content containers
  const tabMenu = element.querySelector('.w-tab-menu');
  const tabContent = element.querySelector('.w-tab-content');
  if (!tabMenu || !tabContent) return;
  // Tab labels
  const tabLinks = Array.from(tabMenu.children);
  const tabLabels = tabLinks.map(link => {
    const labelDiv = link.querySelector('div');
    return labelDiv ? labelDiv.textContent.trim() : link.textContent.trim();
  });
  // Tab panes
  const tabPanes = Array.from(tabContent.children);
  // Prepare the table
  const rows = [];
  // Header row: single cell, as per example
  rows.push(['Tabs']);
  // Content rows: two columns [label, content]
  tabPanes.forEach((pane, idx) => {
    const label = tabLabels[idx] || `Tab ${idx + 1}`;
    const grid = pane.querySelector('div');
    const tabContentElem = grid || pane;
    rows.push([label, tabContentElem]);
  });
  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
