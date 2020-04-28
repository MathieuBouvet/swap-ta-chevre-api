require("dotenv").config();
const accessToken = require("./accessToken.service");
const jwt = require("jsonwebtoken");
const InvalidArgumentError = require("../utils/errors/InvalidArgumentError");

function inNbHours(nbHours) {
  return Math.floor(Date.now() / 1000) + nbHours * 3600;
}

function differenceBetween(timer1, timer2) {
  return Math.abs(timer1 - timer2);
}

describe("AccessToken getter service", () => {
  const user = {
    _id: 42,
  };
  it("should return a valid jwt token", () => {
    const token = accessToken.getFreshToken(user);
    expect(token);
    const decodedToken = jwt.decode(token);
    expect(decodedToken.sub).toBe("42");
    expect(jwt.verify(token, process.env.JWT_SECRET_KEY));
  });
  it("should set the validity of the token correctly", () => {
    const token = accessToken.getFreshToken(user);
    const decoded = jwt.decode(token);
    expect(differenceBetween(decoded.exp, inNbHours(1))).toBeLessThan(5);

    const tokenValidFor5hours = accessToken.getFreshToken(user, "5h");
    const decoded5Hours = jwt.decode(tokenValidFor5hours);
    expect(differenceBetween(decoded5Hours.exp, inNbHours(5))).toBeLessThan(5);
  });
  it("should throw exceptions when not used preoperly", () => {
    expect(() => {
      accessToken.getFreshToken();
    }).toThrowError(InvalidArgumentError);
  });
});
