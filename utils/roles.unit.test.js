const {
  roles: { ADMIN, USER, AUTHOR, ANON },
  roleToString,
  roleFromString,
} = require("./roles");

describe("role from string", () => {
  it.each([
    ["ADMIN", ADMIN],
    ["AUTHOR", AUTHOR],
    ["USER", USER],
    ["ANON", ANON],
  ])(
    "should return the string %s matching the role %p",
    (roleString, roleSymbol) => {
      expect(roleFromString(roleString)).toBe(roleSymbol);
    }
  );

  it.each(["not", "admin", undefined])(
    "should throw an error when given string is not a role name",
    (unkown) => {
      expect(() => roleFromString(unkown)).toThrow();
    }
  );
});

describe("role to string", () => {
  it.each([
    [ADMIN, "ADMIN"],
    [AUTHOR, "AUTHOR"],
    [USER, "USER"],
    [ANON, "ANON"],
  ])(
    "should return the role %p matching the string %s",
    (roleSymbol, roleString) => {
      expect(roleToString(roleSymbol)).toBe(roleString);
    }
  );

  it.each([Symbol("other"), null])(
    "should throw an error when given symbol is not a role",
    (invalid) => {
      expect(() => roleToString(invalid)).toThrow();
    }
  );
});
