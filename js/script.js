'use strict';

// анимация появления контента при скроле

var isScrolling = false;

window.addEventListener("scroll", throttleScroll, false);

function throttleScroll(e) {
  if (isScrolling == false) {
    window.requestAnimationFrame(function() {
      scrolling(e);
      isScrolling = false;
    });
  }
  isScrolling = true;
}

document.addEventListener("DOMContentLoaded", scrolling, false);

var listItems = document.querySelectorAll(".animated-appearance");

for (var listItem of listItems) {
  listItem.classList.add("animated-appearance--hidden");
}

function scrolling(e) {
  for (var listItem of listItems) {
    if (isPartiallyVisible(listItem)) {
      listItem.classList.remove("animated-appearance--hidden");
      listItem.classList.add("animated-appearance--shown");
    }
  }
}

function isPartiallyVisible(el) {
  var elementBoundary = el.getBoundingClientRect();

  var top = elementBoundary.top;
  var bottom = elementBoundary.bottom;
  var height = elementBoundary.height;

  return (height + window.innerHeight >= bottom) /* && (top + height >= 0)*/ ;
}

function isFullyVisible(el) {
  var elementBoundary = el.getBoundingClientRect();

  var top = elementBoundary.top;
  var bottom = elementBoundary.bottom;

  return ((top >= 0) && (bottom <= window.innerHeight));
}

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

var popupMap = document.querySelector(".popup--map");
if (popupMap) {
  var buttonMap = document.querySelector(".map-button");
  var popupMapClose = popupMap.querySelector(".popup-close");

  buttonMap.addEventListener("click", function (evt) {
    evt.preventDefault();
    popupMap.removeAttribute("hidden");
    popupMap.classList.add("popup__iframe-map--show");
  });

  popupMapClose.addEventListener("click", function (evt) {
    evt.preventDefault();
    popupMap.setAttribute("hidden","");
    popupMap.classList.remove("popup__iframe-map--show");
  });

  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      if (!(popupMap.hasAttribute("hidden"))) {
        popupMap.setAttribute("hidden","");
        popupMap.classList.remove("popup__iframe-map--show");
      }
    }
  });
}




// главный слайдер ------------------------------------------------------------------------

const initSlider = (target, swipeThreshold = 0.3, transitionDuration = 0.7) => {
  const sliderWrapper = target.querySelector('.slider__wrapper');
  const sliderList = target.querySelector('.slider__list');
  const slides = target.querySelectorAll('.slider__item');
  const arrows = target.querySelector('.slider__button-list');
  const pinsList = target.querySelector('.slider__markers-list');
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

  let pinsString = '';
  for (let i = 0; i < slides.length; i++) {
    let pin =
    `<li class="slider__markers-item">
      <button class="slider__marker" type="button" name="Slide-${i+1}"><span class="visuallyhidden">Слайд номер ${i+1}</span></button>
    </li>`;
    pinsString += pin;
  }
  pinsList.innerHTML = pinsString;
  const pins = pinsList.querySelectorAll('.slider__markers-item');


  const changeCurrentPin = (oldIndex, newIndex) => {
    pins[oldIndex].classList.remove('slider__markers-item--current');
    pins[newIndex].classList.add('slider__markers-item--current');
  }
  changeCurrentPin(0, 0);

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
          changeCurrentPin(slideIndex, slideIndex - 1);
          slideIndex--;
        } else if (posX1 < posInit) {
          changeCurrentPin(slideIndex, slideIndex + 1);
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
      changeCurrentPin(slideIndex, slideIndex + 1);
      slideIndex++;
    } else if (clickedButton.classList.contains('slider__button-prev')) {
      changeCurrentPin(slideIndex, slideIndex - 1);
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
initSlider(document.querySelector('.slider'), 0.2);
