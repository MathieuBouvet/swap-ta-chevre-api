module.exports = function fieldsAutorization(config) {
  return (ressourceName) => {
    if (config[ressourceName] == null) {
      throw new Error(
        `No configuration found for ressource '${ressourceName}'`
      );
    }
    return (role) => (mode) => (ressource) => {
      const filteredData = {};
      for (let field in ressource) {
        if (config[ressourceName][field][mode].includes(role)) {
          filteredData[field] = ressource[field];
        }
      }
      return filteredData;
    };
  };
};
