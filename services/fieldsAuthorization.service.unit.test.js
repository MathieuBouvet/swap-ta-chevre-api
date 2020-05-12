const fieldsAuthorization = require("./fieldsAuthorization.service");
const { ADMIN, AUTHOR, USER, ANON } = require("../utils/roles");

const input = {
  _id: 42,
  username: "my-name",
  mail: "my-mail@test.com",
  password: "my-password",
  phoneNumber: "0102030405",
  role: "my-role",
};

it.each([
  [
    ADMIN,
    "read",
    {
      _id: 42,
      username: "my-name",
      mail: "my-mail@test.com",
      password: "my-password",
      phoneNumber: "0102030405",
      role: "my-role",
    },
  ],
  [
    AUTHOR,
    "read",
    {
      _id: 42,
      username: "my-name",
      mail: "my-mail@test.com",
      password: "my-password",
      phoneNumber: "0102030405",
      role: "my-role",
    },
  ],
  [
    USER,
    "read",
    {
      _id: 42,
      username: "my-name",
      mail: "my-mail@test.com",
      phoneNumber: "0102030405",
      role: "my-role",
    },
  ],
  [
    ANON,
    "read",
    {
      _id: 42,
      username: "my-name",
      mail: "my-mail@test.com",
      phoneNumber: "0102030405",
      role: "my-role",
    },
  ],
  [
    ADMIN,
    "write",
    {
      _id: 42,
      username: "my-name",
      mail: "my-mail@test.com",
      password: "my-password",
      phoneNumber: "0102030405",
      role: "my-role",
    },
  ],
  [
    AUTHOR,
    "write",
    {
      username: "my-name",
      mail: "my-mail@test.com",
      password: "my-password",
      phoneNumber: "0102030405",
    },
  ],
  [USER, "write", {}],
  [ANON, "write", {}],
])(
  "should return the filtered ressource for %s in %s mode",
  (role, mode, expected) => {
    expect(fieldsAuthorization("user")(role)(mode)(input)).toEqual(expected);
  }
);

it("should throw an error when a ressource lacks configuration", () => {
  expect(() => fieldsAuthorization("ressource-name-not-configured")).toThrow(
    "No configuration found for ressource 'ressource-name-not-configured'"
  );
});

it("should throw an error when a mode lacks configuration", () => {
  expect(() =>
    fieldsAuthorization("user")(ANON)("unconfigured-mode")(input)
  ).toThrow("No configuration found for mode 'unconfigured-mode'");
});

it("should throw an error when a field lacks configuration", () => {
  expect(() =>
    fieldsAuthorization("user")(ANON)("read")({
      ...input,
      unconfiguredField: true,
    })
  ).toThrow("No configuration found for field 'unconfiguredField'");
});
