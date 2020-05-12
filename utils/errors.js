class Http401 extends Error {
  constructor(message) {
    super(message);
    this.name = "Http401";
  }
}

class Http403 extends Error {
  constructor(message) {
    super(message);
    this.name = "Http403";
  }
}

class Http404 extends Error {
  constructor(message) {
    super(message);
    this.name = "Http404";
  }
}

class InvalidArgumentError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidArgumentError";
  }
}

module.exports = {
  Http401,
  Http403,
  Http404,
  InvalidArgumentError,
};
