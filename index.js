const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "randomsecretdan";

const app = express();

app.use(express.json());
const users = [];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(users.find(u => u.username === username)) {
        res.json({
            message: "User already exists"
        })
        return;
    }

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed in"
    });
})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    for(let i = 0; i < users.length; i++) {
        if(users[i].username === username && users[i].password === password) {
            foundUser = users[i];
        }
    }
    if(!foundUser) {
        res.json({
            token: "Invalid credentials"
        })
    }
    else {
        const token = jwt.sign({
            username: foundUser.username
        }, JWT_SECRET);

        res.header("token", token);

        res.json({
            token: token
        })
    }
})

function auth(req, res, next) {
    // const username = req.body.username;
    const token = req.headers.token;
    // let decodedData = null;

    const decodedData = jwt.verify(token, JWT_SECRET);

    if(decodedData.username) {
        req.username = decodedData.username;
        next();
    }
    else {
        res.json({
            message: "You are not logged in"
        })
    }
}

app.get("/me", auth, (req, res) => {
    // const token = req.headers.token;

    // const decodedData = jwt.decode(token); not secure both decode and verify gives same response
    // const decodedData = jwt.verify(token, JWT_SECRET);

    if(req.username) {
        let foundUser = null;

        for(let i = 0; i < users.length; i++) {
            if(users[i].username === req.username) {
                foundUser = users[i];
            }
        }

        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    }

})

app.listen(3000);