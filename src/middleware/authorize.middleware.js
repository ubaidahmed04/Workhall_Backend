function authorize(allowedRoles = []) {
  return (req, res, next) => {

    const role = req.user?.roleid;

    if (!role) {
      return res.fail(401, 'Unauthorized');
    }

    if (role === 1) { //  SUPER_ADMIN roleid assume
      return next();
    }

    if (!allowedRoles.includes(role)) {
      return res.fail(403, 'Access denied. Insufficient permissions.');
    }

    next();
  };
}

module.exports = authorize;
