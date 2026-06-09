function checkAccess(pageKey) {
  return (req, res, next) => {
    const { roleid, pages } = req.user;

    // Super admin — sab allowed
    if (roleid === 1) return next();

    // Pages array me check karo
    if (!pages || !pages.includes(pageKey)) {
      return res.fail(403, 'Access denied.');
    }

    next();
  };
}
module.exports = checkAccess