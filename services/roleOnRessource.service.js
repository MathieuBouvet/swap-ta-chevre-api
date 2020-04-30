const {
  roles: { ADMIN, ANON },
} = require("../utils/roles");

const roleOnressourceConfig = {
};

module.exports = function roleOnRessource(user) {
  return (ressourceName) => (ressource) => {
    if (!user || !user.role) {
      return ANON;
    }
    if (user.role === ADMIN) {
      return ADMIN;
    }
    return roleOnressourceConfig[ressourceName](user, ressource);
  };
};
