/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChild(parent, selector) {
    return Array.from(parent.children).find(child => child.matches(selector));
  }

  // Find the main content wrapper for the columns block
  // Defensive: look for the eventDetailsAcademy section
  const academySection = element.querySelector('.eventDetailsAcademy.section');
  if (!academySection) return;

  // Find the top banner and bottom content
  const topBanner = academySection.querySelector('.eventdetail_top_banner');
  const bottomContent = academySection.querySelector('.eventdetail_banner_bottom_content');
  if (!topBanner) return;

  // --- Column 1: Title, Description, Button ---
  const contentSection = topBanner.querySelector('.eventdetail__content');
  // Defensive: check for contentSection
  if (!contentSection) return;

  // --- Column 2: Image ---
  const imageSection = topBanner.querySelector('.eventdetail__image');
  // Defensive: check for imageSection
  if (!imageSection) return;

  // --- Bottom Row: Delivery Mode & Language ---
  // Each .text contains a label and value
  let bottomRowCells = [];
  if (bottomContent) {
    const textBlocks = bottomContent.querySelectorAll('.text');
    bottomRowCells = Array.from(textBlocks).map(textBlock => {
      // Use the whole textBlock for resilience
      return textBlock;
    });
  }

  // --- Build table rows ---
  // Header row
  const headerRow = ['Columns (columns10)'];

  // First content row: two columns
  const firstRow = [contentSection, imageSection];

  // Second content row: delivery mode & language (if present)
  // Only add if there are at least two columns
  const rows = [headerRow, firstRow];
  if (bottomRowCells.length >= 2) {
    rows.push(bottomRowCells);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
