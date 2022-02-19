let tabsSliderButtons;
let tabsSliderTabs;

function setActiveButtonAndTab(selectedButton, selectedTab) {
  tabsSliderButtons.forEach((element) => {
    element.classList.remove('tabs-slider__button--active');
  });
  tabsSliderTabs.forEach((element) => {
    element.classList.remove('tabs-slider__details--active');
    element.classList.add('tabs-slider__details--hidden');
  });

  if (selectedButton) {
    selectedButton.classList.add('tabs-slider__button--active');
  }
  if (selectedTab) {
    selectedTab.classList.remove('tabs-slider__details--hidden');
    selectedTab.classList.add('tabs-slider__details--active');
  }
}

function onTabSliderClick(evt) {
  const selectedButton = evt.target.closest('.tabs-slider__button');
  if (!selectedButton) return;
  evt.preventDefault();

  const selectedTopic = selectedButton.getAttribute('name');
  const selectedTab = Array.from(tabsSliderTabs).find(
    (element) => element.dataset.topic === selectedTopic,
  );

  setActiveButtonAndTab(selectedButton, selectedTab);
  document.activeElement.blur();
}

export default function tabSliderInit(tabsSliderElement) {
  if (!tabsSliderElement) { return; }

  tabsSliderButtons = tabsSliderElement.querySelectorAll('.tabs-slider__button');
  tabsSliderTabs = tabsSliderElement.querySelectorAll('.tabs-slider__details');

  setActiveButtonAndTab(
    tabsSliderElement.querySelector('.tabs-slider__button--active'),
    tabsSliderElement.querySelector('.tabs-slider__details--active'),
  );

  tabsSliderElement.addEventListener('click', onTabSliderClick);
}
