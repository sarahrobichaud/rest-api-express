exports.calcTotal = array => {
  let sum = 0;
  array.forEach(item => {
    if (!item.hidden) {
      sum = sum + item.value;
    }
  });

  return sum;
};
