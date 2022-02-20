import { initPopup } from './popup';
import animateAppearance from './animate-appearance';
import tabSliderInit from './tabs-slider';
import fetchData from './fetch';
import { generatesSliderContent, generateSliderPins, startSlider } from './slider';

const POPUP_SHOW_CSS_CLASS = 'popup--show';
const tabsSlider = document.querySelector('.tabs-slider');
const callMeBackPopup = document.querySelector('.popup-callback');
const mapPopup = document.querySelector('.popup-map');
const mainSlider = document.querySelector('.main__slider');
const SLIDER_DATA_URL = 'slider/sliderData.json';
const sliderOptions = { swipeThreshold: 0.2 };

animateAppearance('animated-appearance', 250);
tabSliderInit(tabsSlider);

// обратная связь
if (callMeBackPopup) {
  const callMeBackButtons = document.querySelectorAll('.callback-button');
  const popupСallbackClose = callMeBackPopup.querySelector('.popup-close');
  const popupСallbackUnderlay = callMeBackPopup.querySelector('.popup__underlay');
  const popupСallbackMessage = callMeBackPopup.querySelector('#callback-form__message');
  const callMeBackPopupOptions = {
    popupElement: callMeBackPopup,
    popupCloseElements: [popupСallbackClose, popupСallbackUnderlay],
    cssClassPopupShow: POPUP_SHOW_CSS_CLASS,
    onPopupShowCallback: () => popupСallbackMessage.focus(),
  };

  initPopup(callMeBackButtons, callMeBackPopupOptions);
}

// карта
if (mapPopup) {
  const mapButtons = document.querySelectorAll('.map-button');
  const mapPopupCloseButton = document.querySelector('.popup-map .popup-close');
  const mapPopupOptions = {
    popupElement: mapPopup,
    popupCloseElements: [mapPopupCloseButton],
    cssClassPopupShow: POPUP_SHOW_CSS_CLASS,
  };

  initPopup(mapButtons, mapPopupOptions);
}

// главный слайдер
function generateSliderListString(sliderDataArray) {
  let sliderListString = '';
  sliderDataArray.forEach((slideData) => {
    sliderListString += `
    <li class="slider__item">
      <img src="${slideData.src}" width="967" height="628" alt="${slideData.alt}">
    </li>
    `;
  });
  return sliderListString;
}

function generateSliderPinsString(count) {
  const amount = count > 0 ? count : 0;
  let pinsString = '';
  for (let i = 0; i < amount; i += 1) {
    pinsString += `
    <li class="slider__markers-item">
      <button class="slider__marker" type="button" name="Slide-${i + 1}"><span class="visuallyhidden">Слайд номер ${i + 1}</span></button>
    </li>
    `;
  }
  return pinsString;
}

if (mainSlider) {
  fetchData(SLIDER_DATA_URL)
    .then((sliderData) => {
      sliderOptions.sliderListString = generateSliderListString(sliderData);
      sliderOptions.sliderPinsString = generateSliderPinsString(sliderData.length);
      generatesSliderContent(mainSlider, sliderOptions);
      generateSliderPins(mainSlider, sliderOptions);
      startSlider(mainSlider, sliderOptions);
    });
}
