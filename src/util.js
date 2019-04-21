const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const makeImage = (src, alt, className) => {
  const img = new Image();
  img.src = src;
  img.alt = alt;
  img.classList.add(className);
  return img;
};

export {createElement, makeImage};
