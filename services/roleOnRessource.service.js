const {
  roles: { ADMIN, ANON, AUTHOR, USER },
} = require("../utils/roles");

const roleOnressourceConfig = {
  user: (user, ressource) => {
    return user.id === ressource._id ? AUTHOR : USER;
  },
};

module.exports = function roleOnRessource(user) {
  return (ressourceName) => {
    if (!roleOnressourceConfig[ressourceName]) {
      throw new Error(`Ressource ${ressourceName} is not configured`);
    }
    return (ressource) => {
      if (!user || !user.role) {
        return ANON;
      }
      if (user.role === ADMIN) {
        return ADMIN;
      }
      return roleOnressourceConfig[ressourceName](user, ressource);
    };
  };
};
