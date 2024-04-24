const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173'
}));


const port = process.env.PORT || 5000;
const users = require('./routes/usersRoute');

app.use('/api/users', users);

app.listen(port, () => console.log(`Node JS Server started on port ${port}`));
