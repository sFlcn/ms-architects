'use strict';

// Pop-up

const POPUP_SHOW_CSS_CLASS = 'popup--show';

const showPopup = ({popupElement, popupCloseElements, onPopupShow}) => {

  const closePopup = () => {
    popupCloseElements.forEach(element => element.removeEventListener('click', closeButtonHandler));
    document.removeEventListener('keydown', escKeydownHandler);
    popupElement.classList.remove(POPUP_SHOW_CSS_CLASS);
  };

  const escKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closePopup();
    }
  };

  const closeButtonHandler = (evt) => {
    evt.preventDefault();
    closePopup();
  };

  popupElement.classList.add(POPUP_SHOW_CSS_CLASS);
  document.addEventListener('keydown', escKeydownHandler);
  popupCloseElements.forEach(element => element.addEventListener('click', closeButtonHandler));

  if (typeof onPopupShow === 'function') {
    onPopupShow();
  }
};


// анимация появления контента при скролле

const animateAppearance = (elementsCssClass, throttleTimer) => {
  const listItems = document.querySelectorAll(`.${elementsCssClass}`);
  if (!listItems) {
    return;
  }

  for (let item of listItems) {
    item.classList.add(`${elementsCssClass}--hidden`);
  }

  const isPartiallyVisible = (element) => {
    const {top, bottom, height} = element.getBoundingClientRect();
    return (bottom - height < window.innerHeight);
  }

  const scrolling = () => {
    for (let item of listItems) {
      if (isPartiallyVisible(item)) {
        item.classList.remove(`${elementsCssClass}--hidden`);
        item.classList.add(`${elementsCssClass}--shown`);
      }
    }
  }

  let isThrottle = false;

  const throttledScroll = (time) => {
    if (isThrottle) {
      return;
    }

    isThrottle = true;

    setTimeout(() => {
      scrolling();
      isThrottle = false;
    }, throttleTimer);
  }

  window.addEventListener('scroll', throttledScroll);
  document.addEventListener('DOMContentLoaded', scrolling);
}

animateAppearance('animated-appearance', 250);

// слайдер с вкладками

var tabsSlider = document.querySelector(".tabs-slider");
if (tabsSlider) {
  var tabsSliderButtons = tabsSlider.querySelectorAll(".tabs-slider__button");
  var tabsSliderTabs = tabsSlider.querySelectorAll(".tabs-slider__details");

  for (var tabsSliderTab of tabsSliderTabs) {
    if (!tabsSliderTab.classList.contains("tabs-slider__details--active")) tabsSliderTab.setAttribute("hidden","");
  }

  for (var i = 0; i < tabsSliderButtons.length; i++) {
    tabsSliderButtons[i].addEventListener("click", clickHandler.bind(null, i));
  }

  function clickHandler(index, evt) {
    evt.preventDefault();
    var isCurrent = evt.target.classList.contains("tabs-slider__button--active");
    if (isCurrent) {
      return false;
    }
    tabsSlider.querySelector(".tabs-slider__button--active").classList.remove("tabs-slider__button--active");
    evt.target.classList.add("tabs-slider__button--active");
    getTab(index);
    document.activeElement.blur();
  }

  function getTab(tabIndex) {
    try {
      tabsSlider.querySelector(".tabs-slider__details--active").setAttribute("hidden","");
      tabsSliderTabs[tabIndex].removeAttribute("hidden");
      setTimeout(() => {
        tabsSlider.querySelector(".tabs-slider__details--active").classList.remove("tabs-slider__details--active");
        tabsSliderTabs[tabIndex].classList.add("tabs-slider__details--active");
      }, 100);

    }
    catch (e) {
      console.log(e);
    }
  }
}

// обратная связь

const callbackPopup = document.querySelector('.popup-callback');
const callbackButtons = document.querySelectorAll('.callback-button');

if (callbackButtons && callbackPopup) {
  const popupСallbackClose = callbackPopup.querySelector('.popup-close');
  const popupСallbackUnderlay = callbackPopup.querySelector('.popup__underlay');
  const popupСallbackMessage = callbackPopup.querySelector('.callback-form__message');
  const callbackPopupOptions = {
    popupElement: callbackPopup,
    popupCloseElements: [popupСallbackClose, popupСallbackUnderlay],
    onPopupShow: () => popupСallbackMessage.focus(),
  };

  callbackButtons.forEach(element => {
    element.addEventListener('click', (evt) => {
      evt.preventDefault();
      showPopup(callbackPopupOptions);
    });
  });
}

// карта

const mapPopup = document.querySelector('.popup-map');
const mapButton = document.querySelector('.map-button');
const mapPopupCloseButton = document.querySelector('.popup-map .popup-close');

if (mapButton && mapPopup && mapPopupCloseButton) {
  const mapPopupOptions = {
    popupElement: mapPopup,
    popupCloseElements: [mapPopupCloseButton],
  };

  mapButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    showPopup(mapPopupOptions);
  })
}

// главный слайдер

const mainSlider = document.querySelector('.main__slider');

const sliderOptions = {swipeThreshold: 0.2};
const sliderContent = [
  {
    'src': './img/index-slider-1.jpg',
    'alt': 'Проект транспортного узла и досугового центра на архитектурном конкурсе eVOLO New-York 2013.',
  },
  {
    'src': './img/index-slider-2.jpg',
    'alt': 'Наш проект 2',
  },
  {
    'src': './img/index-slider-3.jpg',
    'alt': 'Наш проект 3',
  },
  {
    'src': './img/index-slider-4.jpg',
    'alt': 'Наш проект 4',
  },
];

const loadSlider = (target, sliderContent) => {
  const sliderList = target.querySelector(`.slider__list`);
  const pinsList = target.querySelector('.slider__markers-list');

  let sliderListString = '';
  for (const slide of sliderContent) {
    let slideItem =
    `<li class="slider__item">
      <img src="${slide.src}" width="967" height="628" alt="${slide.alt}">
    </li>`;
    sliderListString += slideItem;
  }
  sliderList.innerHTML = sliderListString;

  const slides = target.querySelectorAll('.slider__item');
  let pinsString = '';
  for (let i = 0; i < slides.length; i++) {
    let pinItem =
    `<li class="slider__markers-item">
      <button class="slider__marker" type="button" name="Slide-${i+1}"><span class="visuallyhidden">Слайд номер ${i+1}</span></button>
    </li>`;
    pinsString += pinItem;
  }
  pinsList.innerHTML = pinsString;

}

const startSlider = (
  target,
  {
    workScreenWidthMax = Infinity,
    swipeThreshold = 0.3,
    transitionDuration = 0.7
  }) => {
  const sliderWrapper = target.querySelector('.slider__wrapper');
  const sliderList = target.querySelector('.slider__list');
  const slides = target.querySelectorAll('.slider__item');
  const arrows = target.querySelectorAll('.slider__button');
  const prev = arrows[0];
  const next = arrows[1];
  const markers = target.querySelectorAll('.slider__markers-item');
  let slideIndex = 0;
  let posInit = 0;
  let posX1 = 0;
  let posX2 = 0;
  let posY1 = 0;
  let posY2 = 0;
  let positionShift = 0;
  let isSwipe = false;
  let isScroll = false;
  let allowSwipe = true;
  let transition = true;
  let toNextTransform = 0;
  let toPrevTransform = 0;
  const transformValueRegExp = /([-0-9.]+(?=px))/;

  let slideWidth;
  let posThreshold;
  let lastTrf;
  const updateWidthData = () => {
    slideWidth = slides[0].offsetWidth;
    posThreshold = slideWidth * swipeThreshold;
    lastTrf = (slides.length - 1) * slideWidth;
  }

  const isNotWorkingScreenWidth = () => {
    return document.documentElement.clientWidth > workScreenWidthMax;
  }

  const updateSliderMarkers = (newIndex = 0) => {
    for (const markerItem of markers) {
      markerItem.classList.remove('slider__markers-item--current');
    }
    markers[newIndex].classList.add('slider__markers-item--current');
  }
  updateSliderMarkers();

  const getEvent = (evt) => {
    if (evt.type.search('touch') !== -1) {
      return evt.touches[0];
    } else {
      return evt;
    }
  };

  const slide = () => {
    updateWidthData();
    updateSliderMarkers(slideIndex);
    if (transition) {
      sliderList.style.transition = `transform ${transitionDuration}s ease-out`;
    }
    sliderList.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;

    prev.classList.toggle('slider__button--disabled', slideIndex === 0);
    prev.toggleAttribute('disabled', slideIndex === 0);
    next.classList.toggle('slider__button--disabled', slideIndex === (slides.length - 1));
    next.toggleAttribute('disabled', slideIndex === (slides.length - 1));
  };

  const swipeStart = (evt) => {
    updateWidthData();
    if (isNotWorkingScreenWidth()) {
      return;
    }
    let userEvt = getEvent(evt);

    if (allowSwipe) {
      transition = true;
      toNextTransform = (slideIndex + 1) * -slideWidth;
      toPrevTransform = (slideIndex - 1) * -slideWidth;

      posInit = posX1 = userEvt.clientX;
      posY1 = userEvt.clientY;

      sliderList.style.transition = '';

      document.addEventListener('touchmove', swipeAction);
      document.addEventListener('touchend', swipeEnd);
      document.addEventListener('mousemove', swipeAction);
      document.addEventListener('mouseup', swipeEnd);

      sliderWrapper.classList.remove('grab');
      sliderWrapper.classList.add('grabbing');
    }
  };

  const swipeAction = (evt) => {
    let userEvt = getEvent(evt);
    let transform = +(sliderList.style.transform.match(transformValueRegExp)[0]);

    posX2 = posX1 - userEvt.clientX;
    posX1 = userEvt.clientX;
    posY2 = posY1 - userEvt.clientY;
    posY1 = userEvt.clientY;

    if (!isSwipe && !isScroll) {
      let posY = Math.abs(posY2);
      if (posY > 11 || posX2 === 0) {
        isScroll = true;
        allowSwipe = false;
      } else {
        isSwipe = true;
      }
    }

    if (isSwipe) {
      if ((slideIndex === 0 && posX1 > posInit)) {
        setTransform(transform, 0);
        return;
      } else if (slideIndex === (slides.length - 1) && posX1 < posInit) {
        setTransform(transform, lastTrf);
        return;
      } else {
        allowSwipe = true;
      }

      if (posInit > posX1 && transform < toNextTransform || posInit < posX1 && transform > toPrevTransform) {
        reachEdge();
        return;
      }

      sliderList.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
    }
  };

  const swipeEnd = () => {
    updateWidthData();
    positionShift = Math.abs(posInit - posX1);
    isScroll = false;
    isSwipe = false;
    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    document.removeEventListener('mouseup', swipeEnd);
    sliderWrapper.classList.add('grab');
    sliderWrapper.classList.remove('grabbing');

    if (allowSwipe) {
      if (positionShift > posThreshold) {
        if (posX1 > posInit) {
          slideIndex--;
        } else if (posX1 < posInit) {
          slideIndex++;
        }
      }

      if (posX1 !== posInit) {
        allowSwipe = false;
        slide();
      } else {
        allowSwipe = true;
      }

    } else {
      allowSwipe = true;
    }
  };

  const setTransform = (transform, compareTransform) => {
    if (transform >= compareTransform) {
      sliderList.style.transform = `translate3d(${compareTransform}px, 0px, 0px)`;
    }
    allowSwipe = false;
  };

  const reachEdge = () => {
    transition = false;
    swipeEnd();
    allowSwipe = true;
  };

  const onArrowsClick = (evt) => {
    const clickedButton = evt.target.closest('button');
    if (clickedButton.classList.contains('slider__button-next')) {
      slideIndex++;
    } else if (clickedButton.classList.contains('slider__button-prev')) {
      slideIndex--;
    } else {
      return;
    }
    slide();
  }

  sliderList.style.transform = 'translate3d(0px, 0px, 0px)';
  sliderWrapper.classList.add('grab');

  sliderList.addEventListener('transitionend', () => allowSwipe = true);
  sliderWrapper.addEventListener('touchstart', swipeStart);
  sliderWrapper.addEventListener('mousedown', swipeStart);
  prev.addEventListener('click', onArrowsClick);
  next.addEventListener('click', onArrowsClick);

  window.addEventListener('resize', () => {
    if (isNotWorkingScreenWidth()) {
      slideIndex = 0;
      slide();
    }
  });
}

if (mainSlider) {
  loadSlider(mainSlider, sliderContent);
  startSlider(mainSlider, sliderOptions);
}
