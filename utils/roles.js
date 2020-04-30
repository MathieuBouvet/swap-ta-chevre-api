const roles = {
  ADMIN: Symbol("ADMIN"),
  AUTHOR: Symbol("AUTHOR"),
  USER: Symbol("USER"),
  ANON: Symbol("ANON"),
};

function roleToString(roleSymbol) {
  switch (roleSymbol) {
    case roles.ADMIN:
      return "ADMIN";
    case roles.AUTHOR:
      return "AUTHOR";
    case roles.USER:
      return "USER";
    case roles.ANON:
      return "ANON";
    default:
      throw new Error(`Cannot convert ${roleSymbol} to a role string`);
  }
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
