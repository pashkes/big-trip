import template from "./create-filter";

const filterList = document.querySelector(`.trip-filter`);

const renderFilter = ()=> {
  filterList.innerHTML = ``;
  filterList.insertAdjacentHTML(`beforeend`, template(`Everything`, `filter-everything`, true));
  filterList.insertAdjacentHTML(`beforeend`, template(`Future`, `filter-filter-future`));
  filterList.insertAdjacentHTML(`beforeend`, template(`Past`, `filter-past`));
};

export default renderFilter;
