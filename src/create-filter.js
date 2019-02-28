const createFilter = (name, id, checked = false) => {
  return `
    <input type="radio" id=${id} name="filter" value="everything" ${checked ? `checked` : ``}>
    <label class="trip-filter__item" for=${id}>${name}</label>
  `;
};

export default createFilter;
