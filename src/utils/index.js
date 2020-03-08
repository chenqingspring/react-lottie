export const getSize = (initial) => {
  return typeof initial === "number" ?
      `${initial}px` :
      initial || "100%";
};