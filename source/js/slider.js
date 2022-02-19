export function generatesSliderContent(
  target,
  {
    sliderListCssClass = 'slider__list',
    sliderListString,
  },
) {
  const sliderList = target.querySelector(`.${sliderListCssClass}`);
  sliderList.innerHTML = sliderListString;
}

export function generateSliderPins(
  target,
  {
    sliderMarkersListCssClass = 'slider__markers-list',
    sliderPinsString,
  },
) {
  const pinsList = target.querySelector(`.${sliderMarkersListCssClass}`);
  pinsList.innerHTML = sliderPinsString;
}

export function startSlider(
  target,
  {
    workScreenWidthMax = Infinity,
    swipeThreshold = 0.3,
    transitionDuration = 0.7,
    sliderWrapperCssClass = 'slider__wrapper',
    sliderListCssClass = 'slider__list',
    sliderItemCssClass = 'slider__item',
    sliderButtonsCssClass = 'slider__button',
    sliderMarkersCssClass = 'slider__markers-item',
    grabCssClass = 'grab',
    grabbingCssClass = 'grabbing',
  },
) {
  const sliderWrapper = target.querySelector(`.${sliderWrapperCssClass}`);
  const sliderList = target.querySelector(`.${sliderListCssClass}`);
  const slides = target.querySelectorAll(`.${sliderItemCssClass}`);
  const sliderButtons = target.querySelectorAll(`.${sliderButtonsCssClass}`);
  const prev = sliderButtons[0];
  const next = sliderButtons[1];
  const markers = target.querySelectorAll(`.${sliderMarkersCssClass}`);
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

  function updateWidthData() {
    slideWidth = slides[0].offsetWidth;
    posThreshold = slideWidth * swipeThreshold;
    lastTrf = (slides.length - 1) * slideWidth;
  }

  function isNotWorkingScreenWidth() {
    return document.documentElement.clientWidth > workScreenWidthMax;
  }

  function updateSliderMarkers(newIndex = 0) {
    markers.forEach((markerItem) => {
      markerItem.classList.remove(`${sliderMarkersCssClass}--current`);
    });
    markers[newIndex].classList.add(`${sliderMarkersCssClass}--current`);
  }
  updateSliderMarkers();

  function getEvent(evt) {
    if (evt.type.search('touch') !== -1) { return evt.touches[0]; }
    return evt;
  }

  function slide() {
    updateWidthData();
    updateSliderMarkers(slideIndex);
    if (transition) {
      sliderList.style.transition = `transform ${transitionDuration}s ease-out`;
    }
    sliderList.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;

    prev.classList.toggle(`${sliderButtonsCssClass}--disabled`, slideIndex === 0);
    prev.toggleAttribute('disabled', slideIndex === 0);
    next.classList.toggle(`${sliderButtonsCssClass}--disabled`, slideIndex === (slides.length - 1));
    next.toggleAttribute('disabled', slideIndex === (slides.length - 1));
  }

  function swipeStart(evt) {
    updateWidthData();
    if (isNotWorkingScreenWidth()) { return; }
    const userEvt = getEvent(evt);

    if (allowSwipe) {
      transition = true;
      toNextTransform = (slideIndex + 1) * -slideWidth;
      toPrevTransform = (slideIndex - 1) * -slideWidth;

      posY1 = userEvt.clientY;
      posX1 = userEvt.clientX;
      posInit = posX1;

      sliderList.style.transition = '';

      document.addEventListener('touchmove', swipeAction);
      document.addEventListener('touchend', swipeEnd);
      document.addEventListener('mousemove', swipeAction);
      document.addEventListener('mouseup', swipeEnd);

      sliderWrapper.classList.remove(`${grabCssClass}`);
      sliderWrapper.classList.add(`${grabbingCssClass}`);
    }
  }

  function swipeAction(evt) {
    const userEvt = getEvent(evt);
    const transform = +(sliderList.style.transform.match(transformValueRegExp)[0]);

    posX2 = posX1 - userEvt.clientX;
    posX1 = userEvt.clientX;
    posY2 = posY1 - userEvt.clientY;
    posY1 = userEvt.clientY;

    if (!isSwipe && !isScroll) {
      const posY = Math.abs(posY2);
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
      }
      if (slideIndex === (slides.length - 1) && posX1 < posInit) {
        setTransform(transform, lastTrf);
        return;
      }
      allowSwipe = true;

      if (
        (posInit > posX1 && transform < toNextTransform)
         || (posInit < posX1 && transform > toPrevTransform)) {
        reachEdge();
        return;
      }

      sliderList.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
    }
  }

  function swipeEnd() {
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
          slideIndex -= 1;
        } else if (posX1 < posInit) {
          slideIndex += 1;
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
  }

  function setTransform(transform, compareTransform) {
    if (transform >= compareTransform) {
      sliderList.style.transform = `translate3d(${compareTransform}px, 0px, 0px)`;
    }
    allowSwipe = false;
  }

  function reachEdge() {
    transition = false;
    swipeEnd();
    allowSwipe = true;
  }

  function onsliderButtonsClick(evt) {
    const clickedButton = evt.target.closest('button');
    if (clickedButton.classList.contains(`${sliderButtonsCssClass}-next`)) {
      slideIndex += 1;
    } else if (clickedButton.classList.contains(`${sliderButtonsCssClass}-prev`)) {
      slideIndex -= 1;
    } else {
      return;
    }
    slide();
  }

  sliderList.style.transform = 'translate3d(0px, 0px, 0px)';
  sliderWrapper.classList.add('grab');

  sliderList.addEventListener('transitionend', () => { allowSwipe = true; });
  sliderWrapper.addEventListener('touchstart', swipeStart);
  sliderWrapper.addEventListener('mousedown', swipeStart);
  prev.addEventListener('click', onsliderButtonsClick);
  next.addEventListener('click', onsliderButtonsClick);

  window.addEventListener('resize', () => {
    if (isNotWorkingScreenWidth()) {
      slideIndex = 0;
      slide();
    }
  });
}
