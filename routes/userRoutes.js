const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt")

// signup route
router.post("/signup", async (req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        console.log("User registered successfully !!");

        const payload = {
            id: response.id,
        }

        const token = generateToken(payload);

        res.status(200).json({ response: response, token: token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" })
    }
})


//login route
router.post("/login", async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;

        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "invalid username or password" });
        }

        const payload = {
            id: user.id
        }
        const token = generateToken(payload);

        res.status(200).json(token);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" })
    }
})

// profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {

    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({ user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });

    }
})

// password change route
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {

    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: "invalid password" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "password updated succesfully!!" });
    } catch (error) {
        res.status(500).json({ error: "internal server error" });

    }
})

module.exports = router;