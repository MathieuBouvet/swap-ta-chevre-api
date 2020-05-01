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
        const authorized = config[ressourceName][field][mode];
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
