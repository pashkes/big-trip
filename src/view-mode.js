const viewMode = document.querySelectorAll(`.view-switch__item`);

const onClickToggleModeView = () => {
  viewMode.forEach((item) => {
    item.addEventListener(`click`, (evt) => {
      const target = evt.target;
      const previousModeLink = document.querySelector(`.view-switch__item--active`);
      const lastHash = previousModeLink.hash.substring(1);
      const currentHash = target.hash.substring(1);
      const previousModeElement = document.querySelector(`#${lastHash}`);
      const targetElement = document.querySelector(`#${currentHash}`);
      previousModeLink.classList.remove(`view-switch__item--active`);
      targetElement.classList.remove(`visually-hidden`);
      previousModeElement.classList.add(`visually-hidden`);
      target.classList.add(`view-switch__item--active`);
    });
  });
};

export default onClickToggleModeView;