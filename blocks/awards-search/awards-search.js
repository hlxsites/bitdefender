let awardsData = [];
let filteredAwards = [];
let yearsToFilterBy = [];

function renderAwardItem(block, award) {
  const awardItemContainer = document.createElement('div');
  awardItemContainer.classList.add('award-item-container');
  const itemTitle = document.createElement('h2');
  itemTitle.append(award.Title);
  awardItemContainer.append(itemTitle);
  const itemDescription = document.createElement('div');
  itemDescription.append(award.Description);
  awardItemContainer.append(itemDescription);

  if (award.Link) {
    const itemLink = document.createElement('a');
    itemLink.innerHTML = 'Read More';
    itemLink.href = award.Link;
    awardItemContainer.append(itemLink);
  }

  block.appendChild(awardItemContainer);
}

function createFiltersContainer(parent) {
  const filtersContainer = document.createElement('div');
  filtersContainer.classList.add('award-results-filters-container');
  parent.append(filtersContainer);
}

function renderAwards(block, data) {
  const awardsResultsContainer = block.querySelector('.awards-results-container');
  awardsResultsContainer.innerHTML = '';
  createFiltersContainer(awardsResultsContainer);
  data.forEach((award) => {
    renderAwardItem(awardsResultsContainer, award);
  });
}

function renderFilters(block) {
  if (yearsToFilterBy.length === 0) {
    return;
  }

  const filtersContainer = block.querySelector('.award-results-filters-container');
  yearsToFilterBy.forEach((year) => {
    const filterItem = document.createElement('div');
    filterItem.append(year);
    filtersContainer.append(filterItem);
  });

  const clearAllLink = document.createElement('a');
  clearAllLink.addEventListener('click', () => {
    yearsToFilterBy = [];
    const checkboxes = block.querySelectorAll('.accordion-item-content input');
    [...checkboxes].forEach((checkbox) => { checkbox.checked = false; });
    filteredAwards = awardsData;
    renderAwards(block, awardsData);
  });
  clearAllLink.innerText = 'Clear All';
  filtersContainer.append(clearAllLink);
}

function renderFilteredAwards(block) {
  renderFilters(block);
  if (yearsToFilterBy.length > 0) {
    filteredAwards = awardsData.filter((award) => yearsToFilterBy.includes(award.Year));
    renderAwards(block, filteredAwards);
  } else {
    filteredAwards = awardsData;
    renderAwards(block, awardsData);
  }
}

function handleFilterByYearCheckbox(block, event) {
  if (event.target.checked) {
    yearsToFilterBy.push(event.target.value);
  } else if (yearsToFilterBy.includes(event.target.value)) {
    yearsToFilterBy = yearsToFilterBy.filter((year) => year !== event.target.value);
  }

  renderFilteredAwards(block);
}

function createAwardsResultContainer(block) {
  const awardsResultsContainer = document.createElement('div');
  awardsResultsContainer.classList.add('awards-results-container');
  createFiltersContainer(awardsResultsContainer);
  block.appendChild(awardsResultsContainer);
}

function createFilterBySection(block, data) {
  const filterByContent = document.createElement('div');
  filterByContent.classList.add('accordion-item-content');
  const filterByYears = data.map((award) => award.Year);
  const filterByYearsUniqueValue = [...new Set(filterByYears)];

  filterByYearsUniqueValue.forEach((year) => {
    const checkboxElement = document.createElement('input');
    checkboxElement.setAttribute('type', 'checkbox');
    checkboxElement.setAttribute('value', year);
    checkboxElement.addEventListener('click', handleFilterByYearCheckbox.bind(null, block));
    const checkboxLabel = document.createElement('label');
    checkboxLabel.append(checkboxElement);
    checkboxLabel.append(year);
    filterByContent.append(checkboxLabel);
  });

  const filterWrapperSection = block.querySelector('.accordion-item');
  filterWrapperSection.classList.add('expanded');
  filterWrapperSection.appendChild(filterByContent);
}

async function fetchAwardsData(block) {
  const awardsLink = block.querySelector('a');
  const data = await fetch(awardsLink.href);
  const awards = await data.json();
  awardsData = [...awards.data];
  filteredAwards = [...awardsData];
  renderAwards(block, filteredAwards);
  createFilterBySection(block, awardsData);
}

function handleTextSearch(searchTextBox, block) {
  const filterBy = searchTextBox.value;
  if (filterBy.length === 0) {
    renderAwards(block, filteredAwards);
    return;
  }

  const filteredByTextAwards = filteredAwards.filter((award) => award.Title.match(new RegExp(`${filterBy}`, 'i')));
  renderAwards(block, filteredByTextAwards);
}

function createSearchTextBox(block) {
  const searchTextBox = document.createElement('input');
  searchTextBox.classList.add('text-box-wrapper');
  searchTextBox.setAttribute('type', 'text');
  searchTextBox.setAttribute('placeholder', 'Search Awards');

  searchTextBox.addEventListener('keyup', handleTextSearch.bind(null, searchTextBox, block));

  const searchMagnifingGlass = document.createElement('button');
  searchMagnifingGlass.classList.add('text-box-search-magnifing-glass');
  searchTextBox.after(searchMagnifingGlass);
  searchMagnifingGlass.addEventListener('click', handleTextSearch.bind(null, searchTextBox, block));

  const filterSection = block.querySelector('.award-search-filter-wrapper');
  filterSection.appendChild(searchTextBox);
  filterSection.appendChild(searchMagnifingGlass);
}

function removeAwardsLinkFromDom(block) {
  [...block.children].forEach((element) => {
    if (element.innerHTML.includes('awards.json')) {
      element.remove();
    }
  });
}

function moveAccordionUnderFilterSection(block) {
  const accordion = document.querySelector('.accordion-wrapper');
  const awardSearchFilterSection = document.createElement('div');
  awardSearchFilterSection.classList.add('award-search-filter-wrapper');
  block.append(awardSearchFilterSection);
  createSearchTextBox(block);
  awardSearchFilterSection.append(accordion);
}

export default async function decorate(block) {
  fetchAwardsData(block);
  removeAwardsLinkFromDom(block);
  moveAccordionUnderFilterSection(block);
  createAwardsResultContainer(block);
}
