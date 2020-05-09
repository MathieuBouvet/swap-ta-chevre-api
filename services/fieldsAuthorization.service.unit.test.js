const fieldsAuthorization = require("./fieldsAuthorization.service");
const { ADMIN, AUTHOR, USER, ANON } = require("../utils/roles");

const testConfig = {
  testRessource: {
    id: {
      read: [ADMIN, AUTHOR, USER, ANON],
      write: [ADMIN],
    },
    username: {
      read: [ADMIN, AUTHOR, USER, ANON],
      write: [ADMIN, AUTHOR],
    },
    mail: {
      read: [ADMIN, AUTHOR, USER],
      write: [ADMIN, AUTHOR],
    },
  },
};

const input = {
  id: 42,
  username: "my-name",
  mail: "my-mail@test.com",
};

it.each([
  [ADMIN, "read", { id: 42, username: "my-name", mail: "my-mail@test.com" }],
  [AUTHOR, "read", { id: 42, username: "my-name", mail: "my-mail@test.com" }],
  [USER, "read", { id: 42, username: "my-name", mail: "my-mail@test.com" }],
  [ANON, "read", { id: 42, username: "my-name" }],
  [ADMIN, "write", { id: 42, username: "my-name", mail: "my-mail@test.com" }],
  [AUTHOR, "write", { username: "my-name", mail: "my-mail@test.com" }],
  [USER, "write", {}],
  [ANON, "write", {}],
])(
  "should return the filtered ressource for the role and mode given",
  (role, mode, expected) => {
    expect(
      fieldsAuthorization(testConfig)("testRessource")(role)(mode)(input)
    ).toEqual(expected);
  }
);

it("should throw an error when a ressource lacks configuration", () => {
  expect(() =>
    fieldsAuthorization(testConfig)("ressource-name-not-configured")
  ).toThrow(
    "No configuration found for ressource 'ressource-name-not-configured'"
  );
});

it("should throw an error when a mode lacks configuration", () => {
  expect(() =>
    fieldsAuthorization(testConfig)("testRessource")(ANON)("unconfigured-mode")(
      input
    )
  ).toThrow("No configuration found for mode 'unconfigured-mode'");
});

it("should throw an error when a field lacks configuration", () => {
  expect(() =>
    fieldsAuthorization(testConfig)("testRessource")(ANON)("read")({
      ...input,
      unconfiguredField: true,
    })
  ).toThrow("No configuration found for field 'unconfiguredField'");
});
