export const getElementViewLeft = ({ offsetLeft, offsetParent }) => {
  let actualLeft = offsetLeft;
  let current = offsetParent;

  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }

  const elementScrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
  return actualLeft - elementScrollLeft;
};

export const pad0 = num => (num < 10 ? `0${num}` : `${num}`);

export default { getElementViewLeft };
