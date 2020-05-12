const roleOnRessource = require("./roleOnRessource.service");
const { ADMIN, AUTHOR, USER, ANON } = require("../utils/roles");

it.each([
  [{ id: 0, role: ADMIN }, "user", { _id: 42 }, ADMIN],
  [{ id: 1, role: USER }, "user", { _id: 1 }, AUTHOR],
  [{ id: 2, role: USER }, "user", { _id: 42 }, USER],
  [null, "user", { _id: 42 }, ANON],
  [{ role: null }, "user", { _id: 42 }, ANON],
  [{ role: ANON }, "user", { _id: 42 }, ANON],
])(
  "should return the user role on a specific ressource",
  (user, ressourceName, ressource, expectedRole) => {
    expect(roleOnRessource(user)(ressourceName)(ressource)).toBe(expectedRole);
  }
);

it.each([
  [{ id: 0, role: ADMIN }, "unknown"],
  [{ id: 1, role: USER }, "unknown"],
  [{ id: 2, role: USER }, "unknown"],
  [null, "unknown"],
  [{ role: null }, "unknown"],
])(
  "should throw an error when a ressource is not configured",
  (user, ressourceName) => {
    expect(() => roleOnRessource(user)(ressourceName)).toThrow();
  }
);
