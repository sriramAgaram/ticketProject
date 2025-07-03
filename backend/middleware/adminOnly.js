export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(400).json({
      success: false,
      message: `Protucted Route Only Admin can Access`,
    });
  } else {
    next();
  }
};
