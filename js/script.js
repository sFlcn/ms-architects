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
