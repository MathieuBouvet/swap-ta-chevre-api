const roles = require("../utils/roles");
const { ADMIN, AUTHOR } = roles;
const ALL = Object.values(roles);

const config = {
  user: {
    _id: {
      read: ALL,
      write: [ADMIN],
    },
    username: {
      read: ALL,
      write: [ADMIN, AUTHOR],
    },
    password: {
      read: [ADMIN, AUTHOR],
      write: [ADMIN, AUTHOR],
    },
    mail: {
      read: ALL,
      write: [ADMIN, AUTHOR],
    },
    phoneNumber: {
      read: ALL,
      write: [ADMIN, AUTHOR],
    },
    role: {
      read: ALL,
      write: [ADMIN],
    },
  },
};

module.exports = function fieldsAutorization(ressourceName) {
  if (config[ressourceName] == null) {
    throw new Error(`No configuration found for ressource '${ressourceName}'`);
  }
  return (role) => (mode) => (ressource) => {
    const filteredData = {};
    for (let field in ressource) {
      const fieldConfiguration = config[ressourceName][field];
      if (fieldConfiguration == null) {
        throw new Error(`No configuration found for field '${field}'`);
      }
      const authorized = fieldConfiguration[mode];
      if (authorized == null) {
        throw new Error(`No configuration found for mode '${mode}'`);
      }
      if (authorized.includes(role)) {
        filteredData[field] = ressource[field];
      }
    }
    return filteredData;
  };
};
