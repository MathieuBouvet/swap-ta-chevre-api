module.exports = function fieldsAutorization(config) {
  return (ressourceName) => (role) => (mode) => (ressource) => {
    const filteredData = {};
    for (let field in ressource) {
      if (config[ressourceName][field][mode].includes(role)) {
        filteredData[field] = ressource[field];
      }
    }
    return filteredData;
  };
};
