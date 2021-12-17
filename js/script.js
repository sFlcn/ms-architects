'use strict';

// анимация появления контента при скролле

const animateAppearance = (elementsCssClass) => {
  const listItems = document.querySelectorAll(`.${elementsCssClass}`);
  let isScrolling = false;

  for (let item of listItems) {
    item.classList.add(`${elementsCssClass}--hidden`);
  }

  const isPartiallyVisible = (element) => {
    const elementBoundary = element.getBoundingClientRect();
    const top = elementBoundary.top;
    const bottom = elementBoundary.bottom;
    const height = elementBoundary.height;
    return (height + window.innerHeight >= bottom) /* && (top + height >= 0)*/ ;
  }

  const isFullyVisible = (element) => {
    const elementBoundary = el.getBoundingClientRect();
    const top = elementBoundary.top;
    const bottom = elementBoundary.bottom;
    return ((top >= 0) && (bottom <= window.innerHeight));
  }

  const scrolling = (evt) => {
    for (let item of listItems) {
      if (isPartiallyVisible(item)) {
        item.classList.remove(`${elementsCssClass}--hidden`);
        item.classList.add(`${elementsCssClass}--shown`);
      }
    }
  }

  const throttleScroll = (evt) => {
    if (isScrolling === false) {
      window.requestAnimationFrame(() => {
        scrolling(evt);
        isScrolling = false;
      });
    }
    isScrolling = true;
  }

  window.addEventListener("scroll", throttleScroll);
  document.addEventListener("DOMContentLoaded", scrolling);
}

animateAppearance('animated-appearance');

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

var popupСallback = document.querySelector(".popup--callback");
if (popupСallback) {
  var popupСallbackClose = popupСallback.querySelector(".popup-close");
  var popupСallbackUnderlay = popupСallback.querySelector(".popup__underlay");
  var popupСallbackContent = popupСallback.querySelector(".popup__content");
  var popupСallbackMessage = document.getElementById("callback-form__message");
  var buttonsСallback = document.querySelectorAll(".callback-button");

  for (var buttonСallback of buttonsСallback) {
    buttonСallback.addEventListener("click", function (evt) {
      evt.preventDefault();
      popupСallback.removeAttribute("hidden");
      popupСallbackContent.classList.add("popup-show");
      popupСallbackMessage.focus();
    });
  }

  popupСallbackClose.addEventListener("click", function (evt) {
    evt.preventDefault();
    popupСallback.setAttribute("hidden","");
    popupСallbackContent.classList.remove("popup-show");
  });

  popupСallbackUnderlay.addEventListener("click", function (evt) {
    evt.preventDefault();
    popupСallback.setAttribute("hidden","");
    popupСallbackContent.classList.remove("popup-show");
  });

  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      if (!(popupСallback.hasAttribute("hidden"))) {
        popupСallback.setAttribute("hidden","");
        popupСallbackContent.classList.remove("popup-show");
      }
    }
  });
}

// карта

const initPopup = (popupCssClass, callButtonCssClass, closeButtonCssClass) => {
  const popup = document.querySelector(`.${popupCssClass}`);
  if (!popup) {
    return
  };
  const popupCloseButton = popup.querySelector(`.${closeButtonCssClass}`);
  const callButtons = document.querySelectorAll(`.${callButtonCssClass}`);

  const callButtonClickHandler = (evt) => {
    evt.preventDefault();
    popup.removeAttribute('hidden');
    popupCloseButton.addEventListener('click', closeButtonClickHandler);
    window.addEventListener('keydown', escClickHandler);
  }

  const closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    popup.setAttribute('hidden', 'true');
    popupCloseButton.removeEventListener('click', closeButtonClickHandler);
    window.removeEventListener('keydown', escClickHandler);
  }

  const escClickHandler = (evt) => {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      popup.toggleAttribute('hidden');
      popupCloseButton.removeEventListener('click', closeButtonClickHandler);
      window.removeEventListener('keydown', escClickHandler);
    }
  }

  for (let button of callButtons) {
    button.addEventListener('click', callButtonClickHandler);
  }
}
initPopup('popup--map', 'map-button', 'popup-close');

// главный слайдер ------------------------------------------------------------------------

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
]

const loadSlider = (targetCssClass, sliderContent) => {
  const target = document.querySelector(`.${targetCssClass}`);
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
loadSlider('slider', sliderContent);

const initSlider = (targetCssClass, swipeThreshold = 0.3, transitionDuration = 0.7) => {
  const target = document.querySelector(`.${targetCssClass}`);
  if (!target) {
    return
  };
  const sliderWrapper = target.querySelector('.slider__wrapper');
  const sliderList = target.querySelector('.slider__list');
  const slides = target.querySelectorAll('.slider__item');
  const arrows = target.querySelector('.slider__button-list');
  const markers = target.querySelectorAll('.slider__markers-item');
  const prev = arrows.children[0];
  const next = arrows.children[1];
  const slideWidth = slides[0].offsetWidth;
  const posThreshold = slideWidth * swipeThreshold;
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
  const lastTrf = (slides.length - 1) * slideWidth;
  const transformValueRegExp = /([-0-9.]+(?=px))/;

  const changeCurrentMarker = (oldIndex, newIndex) => {
    markers[oldIndex].classList.remove('slider__markers-item--current');
    markers[newIndex].classList.add('slider__markers-item--current');
  }
  changeCurrentMarker(0, 0);

  const getEvent = () => {
    if (event.type.search('touch') !== -1) {
      return event.touches[0];
    } else {
      return event;
    }
  };

  const slide = () => {
    if (transition) {
      sliderList.style.transition = `transform ${transitionDuration}s ease-out`;
    }
    sliderList.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;

    prev.classList.toggle('slider__button--disabled', slideIndex === 0);
    next.classList.toggle('slider__button--disabled', slideIndex === (slides.length - 1));
  };

  const swipeStart = () => {
    let userEvt = getEvent();

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

  const swipeAction = () => {
    let userEvt = getEvent();
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
          changeCurrentMarker(slideIndex, slideIndex - 1);
          slideIndex--;
        } else if (posX1 < posInit) {
          changeCurrentMarker(slideIndex, slideIndex + 1);
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
    const clickedButton = evt.target;
      console.log(clickedButton);
    if (clickedButton.classList.contains('slider__button-next')) {
      changeCurrentMarker(slideIndex, slideIndex + 1);
      slideIndex++;
    } else if (clickedButton.classList.contains('slider__button-prev')) {
      changeCurrentMarker(slideIndex, slideIndex - 1);
      slideIndex--;
    } else {
      return;
    }
    slide();
  }

  sliderList.style.transform = 'translate3d(0px, 0px, 0px)';
  sliderWrapper.classList.add('grab');

  sliderList.addEventListener('transitionend', () => allowSwipe = true);
  target.addEventListener('touchstart', swipeStart);
  target.addEventListener('mousedown', swipeStart);
  arrows.addEventListener('click', (evt) => onArrowsClick(evt));

}
initSlider('slider', 0.2);
