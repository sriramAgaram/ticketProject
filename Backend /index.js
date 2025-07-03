const express = require("express");

const app = express();

const dontenv = require("dotenv");

const path = require("path");

dontenv.config();

const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

const authApi = require("./routes/auth.routes");
const ticketApi = require("./routes/ticket.routes");
app.use(express.json());
app.use(express.urlencoded(true));
app.use(cors());

app.use("/auth", authApi);
app.use("/api", ticketApi);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server is running on Portt ${PORT}`);
});
