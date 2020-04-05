require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtAuth = require("./jwtAutentication");
const passport = require("passport");
const jwtStrategy = require("../utils/passport-strategies/jwt.strategy");

const mockRequest = (data, notExpired = true) => {
  const expiration = Math.floor(Date.now() / 1000) + (notExpired ? 60 : -60);
  return {
    cookies: {
      accessToken: jwt.sign(
        { ...data, exp: expiration },
        process.env.JWT_SECRET_KEY
      ),
    },
  };
};
const mockNext = () => jest.fn();

passport.use(jwtStrategy);

describe("Jwt autentication middleware", () => {
  it("should attach a valid access token to the req object", () => {
    const req = mockRequest({ sub: "me" });
    const next = mockNext();
    jwtAuth(req, null, next);
    expect(next.mock.calls[0].length).toBe(0);
    expect(req).toHaveProperty("userToken");
    expect(req.userToken).toHaveProperty("sub");
  });
});
