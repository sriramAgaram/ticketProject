const express = require("express");
const {
  signupController,
  loginController,
  deleteUserController,
  loggedUser,
  getAllUser,
} = require("../controller/auth.controller");
const { verifyToken } = require("../middleware/verifyRoute");
const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.delete("/deleteuser/:id", deleteUserController);
router.get("/getadmin", getAllUser);

// for testing jwt

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    success: true,
    userId: req.user.id,
    userRole:req.user.role,
    message: "Access granted to protected route",
  });
});

router.get("/user", verifyToken, loggedUser);

module.exports = router;
