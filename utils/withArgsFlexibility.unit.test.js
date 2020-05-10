const withArgsFlexibility = require("./withArgsFlexibility");

const testFunction = (first) => (second) => (third) => (fourth) => (fifth) =>
  first + second + third + fourth + fifth;

const flexible = withArgsFlexibility(testFunction);

it.each([
  [flexible(1, 2, 3, 4, 5), testFunction(1)(2)(3)(4)(5)],
  [flexible(1, 2, 3, 4)(5), testFunction(1)(2)(3)(4)(5)],
  [flexible(1, 2, 3)(4)(5), testFunction(1)(2)(3)(4)(5)],
  [flexible(1, 2)(3)(4)(5), testFunction(1)(2)(3)(4)(5)],
  [flexible(1)(2)(3)(4)(5), testFunction(1)(2)(3)(4)(5)],
])(
  "should be the same result as the fuly curried version",
  (flexible, fullyCurried) => {
    expect(flexible).toBe(fullyCurried);
  }
);

it("should ignore argument overflow", () => {
  expect(flexible(1, 2, 3, 4, 5, 6, 7, 8, 9)).toBe(testFunction(1)(2)(3)(4)(5));
});
