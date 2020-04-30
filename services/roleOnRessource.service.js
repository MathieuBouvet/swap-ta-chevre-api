const {
  roles: { ADMIN, ANON, AUTHOR, USER },
} = require("../utils/roles");

const roleOnressourceConfig = {
  user: (user, ressource) => {
    return user.id === ressource._id ? AUTHOR : USER;
  },
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
