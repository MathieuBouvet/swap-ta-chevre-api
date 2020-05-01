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
};
