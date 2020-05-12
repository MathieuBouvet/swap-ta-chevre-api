const { ADMIN, ANON, AUTHOR, USER } = require("../utils/roles");
const withArgsFlexibility = require("../utils/withArgsFlexibility");

const roleOnressourceConfig = {
  user: (user, ressource) => {
    return user.id.toString() === ressource._id.toString() ? AUTHOR : USER;
  },
};

module.exports = withArgsFlexibility(function roleOnRessource(user) {
  return (ressourceName) => {
    if (!roleOnressourceConfig[ressourceName]) {
      throw new Error(`Ressource ${ressourceName} is not configured`);
    }
    return (ressource) => {
      if (!user || !user.role || user.role === ANON) {
        return ANON;
      }
      if (user.role === ADMIN) {
        return ADMIN;
      }
      return roleOnressourceConfig[ressourceName](user, ressource);
    };
  };
});
