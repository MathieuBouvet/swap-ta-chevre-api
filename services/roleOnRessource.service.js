const {
  roles: { ANON },
} = require("../utils/roles");

module.exports = function roleOnRessource(user) {
  return (ressourceName) => (ressource) => {
    if (!user || !user.role) {
      return ANON;
    }
  };
};
