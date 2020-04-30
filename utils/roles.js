const roles = {
  ADMIN: Symbol("ADMIN"),
  AUTHOR: Symbol("AUTHOR"),
  USER: Symbol("USER"),
  ANON: Symbol("ANON"),
};

function roleToString(roleSymbol) {
  for (let roleName in roles) {
    if (roles[roleName] === roleSymbol) {
      return roleName;
    }
  }
  throw new Error(`Cannot convert ${roleSymbol} to a role string`);
}

function roleFromString(roleString) {
  if (!roles[roleString]) {
    throw new Error(`Cannot convert ${roleString} to a role symbol`);
  }
  return roles[roleString];
}

module.exports = {
  roles,
  roleFromString,
  roleToString,
};
