module.exports = {
  down: (num, decimals) => {
    return Math.floor(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
};
