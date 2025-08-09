/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches exactly the example
  const headerRow = ['Cards (cards2)'];
  const cells = [headerRow];

  // Main grid layout
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all immediate children of the grid (could be a, div, etc)
  const gridChildren = Array.from(grid.children);
  // The first child is the large feature card (a.utility-link-content-block)
  const featureCard = gridChildren.find(child => child.matches('a.utility-link-content-block'));
  if (featureCard) {
    // Left cell = image (first img inside a div)
    const img = featureCard.querySelector('img');
    // Right cell = tag(s), heading, paragraph
    const textBlock = document.createElement('div');
    const tagGroup = featureCard.querySelector('.tag-group');
    const heading = featureCard.querySelector('h3');
    const para = featureCard.querySelector('p');
    if (tagGroup) textBlock.appendChild(tagGroup);
    if (heading) textBlock.appendChild(heading);
    if (para) textBlock.appendChild(para);
    cells.push([
      img,
      textBlock
    ]);
  }

  // Second child is a flex container with two cards (sport, beach)
  const leftFlex = gridChildren.find(child => child.classList.contains('flex-horizontal'));
  if (leftFlex) {
    const leftCards = Array.from(leftFlex.querySelectorAll('a.utility-link-content-block'));
    leftCards.forEach(card => {
      const img = card.querySelector('img');
      const textBlock = document.createElement('div');
      const tagGroup = card.querySelector('.tag-group');
      const heading = card.querySelector('h3');
      const para = card.querySelector('p');
      if (tagGroup) textBlock.appendChild(tagGroup);
      if (heading) textBlock.appendChild(heading);
      if (para) textBlock.appendChild(para);
      cells.push([
        img,
        textBlock
      ]);
    });
  }

  // Third child is a flex container with only text cards (no images)
  // Each card is an a.utility-link-content-block, separated by .divider
  const flexContainers = gridChildren.filter(child => child.classList.contains('flex-horizontal'));
  // The right flex is the one after leftFlex
  let flexRight = null;
  if (flexContainers.length > 1) {
    flexRight = flexContainers[1];
  } else if (gridChildren.length > 2 && gridChildren[2].classList.contains('flex-horizontal')) {
    flexRight = gridChildren[2];
  }
  if (flexRight) {
    const rightCards = Array.from(flexRight.querySelectorAll('a.utility-link-content-block'));
    rightCards.forEach(card => {
      const textBlock = document.createElement('div');
      const heading = card.querySelector('h3');
      const para = card.querySelector('p');
      if (heading) textBlock.appendChild(heading);
      if (para) textBlock.appendChild(para);
      cells.push([
        '',
        textBlock
      ]);
    });
  }

  // Create table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
