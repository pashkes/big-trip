import {getStatistics, updateData} from "./statistics";
import {state} from "./state";

const viewMode = document.querySelectorAll(`.view-switch__item`);

const buttonClickToggleModeHandler = (evt) => {
  const target = evt.target;
  evt.preventDefault();
  if (target.closest(`.view-switch__item--active`)) {
    return;
  }
  const previousModeLink = document.querySelector(`.view-switch__item--active`);
  const lastHash = previousModeLink.hash.substring(1);
  const currentHash = target.hash.substring(1);
  const previousModeElement = document.querySelector(`#${lastHash}`);
  const targetElement = document.querySelector(`#${currentHash}`);
  getStatistics(state.events, updateData);
  previousModeLink.classList.remove(`view-switch__item--active`);
  targetElement.classList.remove(`visually-hidden`);
  previousModeElement.classList.add(`visually-hidden`);
  target.classList.add(`view-switch__item--active`);
  window.scrollTo(0, 0);
};

const toggleMode = () => {
  viewMode.forEach((item) => {
    item.addEventListener(`click`, buttonClickToggleModeHandler);
  });
};

export default toggleMode;
