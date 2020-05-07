require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtAuth = require("./jwtAutentication");
const passport = require("passport");
const jwtStrategy = require("../utils/passport-strategies/jwt.strategy");
const Http401 = require("../utils/errors/Http401");

const mockRequest = (data, tokenGenMode = "VALID") => {
  const expiration =
    Math.floor(Date.now() / 1000) + (tokenGenMode === "EXPIRED" ? -60 : 60);
  let accessToken = jwt.sign(
    { ...data, exp: expiration },
    tokenGenMode === "INVALID_KEY" ? "invalid_key" : process.env.JWT_SECRET_KEY
  );
  if (tokenGenMode === "TEMPERED_WITH") {
    const temperedJwtParts = jwt
      .sign({ sub: "hahaha not me" }, process.env.JWT_SECRET_KEY)
      .split(".");
    const accessTokenJwtParts = accessToken.split(".");
    accessToken = [
      accessTokenJwtParts[0],
      temperedJwtParts[1],
      accessTokenJwtParts[2],
    ].join(".");
  }
  if (tokenGenMode === "EMPTY") {
    accessToken = null;
  }
  return {
    cookies: {
      get() {
        return accessToken;
      },
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

  it.each([
    ["has expired", mockRequest({ sub: "me" }, "EXPIRED")],
    ["is invalid", mockRequest({ sub: "me" }, "INVALID_KEY")],
    ["was tempered with", mockRequest({ sub: "me" }, "TEMPERED_WITH")],
    ["is empty", mockRequest({ sub: "me" }, "EMPTY")],
  ])("should not authenticate user when token %s", (testName, req) => {
    const next = mockNext();
    jwtAuth(req, null, next);
    expect(next).toHaveBeenCalledWith(expect.any(Http401));
    expect(req).not.toHaveProperty("userToken");
  });
});
