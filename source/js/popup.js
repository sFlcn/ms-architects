function showPopup({
  popupElement,
  popupCloseElements,
  cssClassPopupShow,
  onPopupShowCallback,
}) {
  function closePopup() {
    popupCloseElements.forEach((element) => element.removeEventListener('click', closeButtonHandler));
    document.removeEventListener('keydown', escKeydownHandler);
    popupElement.classList.remove(cssClassPopupShow);
  }

  function escKeydownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closePopup();
    }
  }

  function closeButtonHandler(evt) {
    evt.preventDefault();
    closePopup();
  }

  popupElement.classList.add(cssClassPopupShow);
  document.addEventListener('keydown', escKeydownHandler);
  popupCloseElements.forEach((element) => element.addEventListener('click', closeButtonHandler));
  if (typeof onPopupShowCallback === 'function') { onPopupShowCallback(); }
}

export default showPopup;
