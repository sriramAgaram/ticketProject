const express = require("express");
const {
  createTicketController,
  getTicketsController,
  updateTicketController,
  getSingleTicket,
  searchCotroller,
  assignedTicketsController,
  getTicketsHistory,
} = require("../controller/ticket.controller");
const { verifyToken } = require("../middleware/verifyRoute");
const { adminOnly } = require("../middleware/adminOnly");
const upload = require("../middleware/multer.config");

const router = express.Router();

router.post(
  "/createticket",
  upload.single("image"),
  verifyToken,
  createTicketController
);
router.get("/getticket", verifyToken, getTicketsController);
router.put("/updateticket/:id", verifyToken, adminOnly, updateTicketController);
router.get("/getsingleticket/:id", verifyToken, getSingleTicket);
router.get("/gettickethistory/:id",getTicketsHistory )
// router.post("/search", verifyToken, searchCotroller);

router.get("/assignedtickets",verifyToken, assignedTicketsController);

module.exports = router;
