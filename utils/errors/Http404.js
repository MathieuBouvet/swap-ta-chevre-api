class Http404 extends Error {
  constructor(message) {
    super(message);
    this.name = "Http404";
  }
}

module.exports = Http404;
