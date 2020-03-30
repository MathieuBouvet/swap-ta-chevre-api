class Http401 extends Error {
  constructor(message) {
    super(message);
    this.name = "Http401";
  }
}

module.exports = Http401;
