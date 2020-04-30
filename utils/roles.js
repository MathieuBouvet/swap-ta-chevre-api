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
  switch (roleString) {
    case "ADMIN":
      return roles.ADMIN;
    case "AUTHOR":
      return roles.AUTHOR;
    case "USER":
      return roles.USER;
    case "ANON":
      return roles.ANON;
    default:
      throw new Error(`Cannot convert ${roleString} to a role symbol`);
  }
}

module.exports = {
  roles,
  roleFromString,
  roleToString,
};
