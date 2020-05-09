require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtAuth = require("./jwtAutentication");
const passport = require("passport");
const jwtStrategy = require("../utils/passport-strategies/jwt.strategy");
const { Http401 } = require("../utils/errors");

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

const payload = {
  sub: "me",
  role: "my-role",
};

describe("Jwt autentication middleware", () => {
  it("should attach a valid access token to the req object", () => {
    const req = mockRequest(payload);
    const next = mockNext();
    jwtAuth(req, null, next);
    expect(next.mock.calls[0].length).toBe(0);
    expect(req).toHaveProperty("userToken");
    expect(req.userToken).toHaveProperty("sub");
    expect(req.userToken).toHaveProperty("role");
  });

  it.each([
    ["has expired", mockRequest(payload, "EXPIRED"), "jwt expired"],
    ["is invalid", mockRequest(payload, "INVALID_KEY"), "invalid signature"],
    [
      "was tempered with",
      mockRequest(payload, "TEMPERED_WITH"),
      "invalid signature",
    ],
    ["is empty", mockRequest(payload, "EMPTY"), "No auth token"],
    [
      "has no subject claim",
      mockRequest({ role: "my-role" }),
      "An access token must have a 'subject' and a 'role' claim",
    ],
    [
      "has no role claim",
      mockRequest({ sub: "me" }),
      "An access token must have a 'subject' and a 'role' claim",
    ],
    ["is not set", {}, "No auth token"],
  ])(
    "should not authenticate user when token %s",
    (testName, req, errorMessage) => {
      const next = mockNext();
      jwtAuth(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.any(Http401));
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
      expect(req).not.toHaveProperty("userToken");
    }
  );
});
