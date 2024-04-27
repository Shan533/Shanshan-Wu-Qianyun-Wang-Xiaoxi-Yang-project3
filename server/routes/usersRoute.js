const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");

function cookieDecryptor(request) {
  const token = request.cookies.token;
  if (!token) {
    return false;
  } else {
    try {
      return jwt.verify(token, process.env.jwt_secret).username;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

// localhost:8000/users/?startOfUsername=h
router.post("/register", async function (request, response) {
  const requestBody = request.body;
  const username = requestBody.username;
  const password = requestBody.password;

  if (!username || !password) {
    response.status(400);
    return response.send("Username and password are required.");
  }

  const existingUser = await UserModel.getUserByUsername(username);
  if (existingUser) {
    response.status(400);
    return response.send("Username already exists.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    username: username,
    password: hashedPassword,
  };

  try {
    await UserModel.insertUser(newUser);
    const cookieData = { username: username };
    const token = jwt.sign(cookieData, process.env.jwt_secret, {
      expiresIn: "14d",
    });
    response.cookie("token", token, { httpOnly: true });
    return response.send(
      "User with username " + username + " registered successfully."
    );
  } catch (error) {
    response.status(400);
    return response.send("Failed to register user with message " + error);
  }
});

router.post("/login", async function (request, response) {
  const username = request.body.username;
  const password = request.body.password;

  if (!username || !password) {
    response.status(400).send("Username and password are required.");
    return;
  }

  try {
    const user = await UserModel.getUserByUsername(username);
    if (!user) {
      response.status(400).send("Invalid username or password.");
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      response.status(400).send("Invalid username or password.");
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1h",
    });
    response.json({ token, user }); // Include the user object in the response
  } catch (error) {
    response.status(400).send("Failed to login: " + error);
  }
});

router.get("/loggedIn", async function (request, response) {
  const token = request.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.jwt_secret);
      const userId = decoded.userId;
      const user = await UserModel.getUserById(userId);
      response.json({ user });
    } catch (error) {
      response.status(401).send("Invalid token");
    }
  } else {
    response.status(401).send("No token provided");
  }
});

router.post("/logout", function (request, response) {
  response.json({ message: "Logged out successfully" });
});

router.get("/:userId", async function (request, response) {
  const userId = request.params.userId;

  try {
    const user = await UserModel.getUserById(userId);

    if (!user) {
      response.status(404).send("User not found");
      return;
    }

    response.json(user);
  } catch (error) {
    response.status(500).send("Failed to retrieve user: " + error);
  }
});

module.exports = router;
