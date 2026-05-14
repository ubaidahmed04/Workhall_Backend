function authorize(allowedRoles = []) {
  return (req, res, next) => {

    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Super Admin bypass
    if (role === 'SUPER_ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}

module.exports = authorize;