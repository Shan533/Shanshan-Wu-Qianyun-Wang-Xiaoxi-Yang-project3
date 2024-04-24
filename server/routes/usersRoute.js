const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel')

function cookieDecryptor(request) {
    const token = request.cookies.token;  
    if (!token) {
        return false;
    } else {
        try {
            return jwt.verify(token, 'USER_SECRET').username;
        } catch (error) {
            console.log(error);
            return false;
        }

    }
}

// localhost:8000/users/?startOfUsername=h
router.post('/register', async function(request, response) {
    const requestBody = request.body;
    const username = requestBody.username;
    const password = requestBody.password;

    if (!username || !password) {
        response.status(400);
        return response.send('Username and password are required.');
    }

    const existingUser = await UserModel.getUserByUsername(username);
    if (existingUser) {
        response.status(400);
        return response.send('Username already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        username: username,
        password: hashedPassword
    };

    try {
        await UserModel.insertUser(newUser);
        const cookieData = {username: username};
        const token = jwt.sign(cookieData, 'USER_SECRET', {
            expiresIn: '14d'
        });
        response.cookie('token', token, {httpOnly: true});
        return response.send('User with username ' + username + ' registered successfully.' )
    } catch (error) {
        response.status(400);
        return response.send('Failed to register user with message ' + error)
    }
});

router.post('/login', async function(request, response) {
    const username = request.body.username;
    const password = request.body.password

    if (!username || !password) {
        response.status(400);
        return response.send('Username and password are required.');
    }

    try {
        const getUserResponse = await UserModel.getUserByUsername(username);
        if(!getUserResponse) {
            response.status(400);
            return response.send('No user found.')
        }
        const isMatch = await bcrypt.compare(password, getUserResponse.password);
        if (!isMatch) {
            response.status(400)
            return response.send('Passwords don\'t match.' )
        }
        const cookieData = {username: username};
        
        const token = jwt.sign(cookieData, 'USER_SECRET', {
            expiresIn: '14d'
        });

        response.cookie('token', token, {httpOnly: true});

        return response.send('Logged in successfully.' )
    } catch (error) {
        response.status(400);
        return response.send('Failed to login: ' + error)
    }
});

router.get('/loggedIn', function(request, response) {
    const username = cookieDecryptor(request);

    if(username) {
        return response.send({
            username: username,
        });
    } else {
        response.status(400);
        return response.send('Not logged in.');
    }
})

router.post('/logout', function(request, response) {
    response.clearCookie('token');
    return response.send('Logged out successfully.');
});


module.exports = router;