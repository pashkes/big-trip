const filterList = document.querySelector(`.trip-filter`);
filterList.innerHTML = ``;
const makeFilter = (name, id, checked = false) => {
  const template = `
    <input type="radio" id=${id} name="filter" value="everything" ${checked ? `checked` : ``}>
    <label class="trip-filter__item" for=${id}>${name}</label>
  `;
  filterList.insertAdjacentHTML(`beforeend`, template);
};

export default makeFilter;
