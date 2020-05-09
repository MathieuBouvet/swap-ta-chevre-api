const withErrorDispatcherToExpress = require("./withErrorDispatcherToExpress");
const { InvalidArgumentError } = require("./errors");

describe("withErrorDispatcherToExpress wrapper", () => {
  it("should return a function", () => {
    const wrappedMethod = withErrorDispatcherToExpress(() => null);
    expect(typeof wrappedMethod).toBe("function");
  });

  it("should only accept a function as its argument", () => {
    expect(() => withErrorDispatcherToExpress(42)).toThrow(
      InvalidArgumentError
    );
  });

  it("should dispatch errors thrown in normal functions to express handler", () => {
    const nextMock = jest.fn((err) => err);
    const req = {};
    const res = {};
    const wrappedMethod = withErrorDispatcherToExpress(() => {
      throw new Error("a test error");
    });
    wrappedMethod(req, res, nextMock);
    expect(nextMock.mock.calls[0][0].message).toBe("a test error");
  });

  it("should dispatch errors thrown in async functions to express handler", async () => {
    const nextMock = jest.fn((err) => err);
    const req = {};
    const res = {};
    const wrappedMethod = withErrorDispatcherToExpress(async () => {
      throw new Error("a test error");
    });
    await wrappedMethod(req, res, nextMock);
    expect(nextMock.mock.calls[0][0].message).toBe("a test error");
  });
});
