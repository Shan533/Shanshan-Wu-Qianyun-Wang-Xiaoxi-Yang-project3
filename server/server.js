const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const port = process.env.PORT || 5000;
const users = require("./routes/usersRoute");
const passwords = require("./routes/passwordRoute");

app.use("/api/users", users);
app.use("/api/passwords", passwords);

const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(port, () => console.log(`Node JS Server started on port ${port}`));
