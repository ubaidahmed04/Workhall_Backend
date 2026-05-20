function authorize(allowedRoles = []) {
  return (req, res, next) => {

    const role = req.user?.roleid;

    if (!role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (role === 1) { //  SUPER_ADMIN roleid assume
      return next();
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
}

module.exports = authorize;