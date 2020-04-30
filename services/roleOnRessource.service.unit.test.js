const roleOnRessource = require("./roleOnRessource.service");
const {
  roles: { ADMIN, AUTHOR, USER, ANON },
} = require("../utils/roles");

it.each([
  [{ id: 0, role: ADMIN }, "user", { _id: 42 }, ADMIN],
  [{ id: 1, role: USER }, "user", { _id: 1 }, AUTHOR],
  [{ id: 2, role: USER }, "user", { _id: 42 }, USER],
  [null, "user", { _id: 42 }, ANON],
  [{ role: null }, "user", { _id: 42 }, ANON],
])(
  "should return the user role on a specific ressource",
  (user, ressourceName, ressource, expectedRole) => {
    expect(roleOnRessource(user)(ressourceName)(ressource)).toBe(expectedRole);
  }
);
