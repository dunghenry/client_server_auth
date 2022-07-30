const User = require('../models/User');
const UserVerification = require('../models/UserVerification');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { userValidation, userLoginValidation } = require('../helpers/validateUser');
const logEvents = require('../helpers/logEvents');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const UserToken = require('../models/UserToken');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../helpers/generateToken');
dotenv.config();
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
});

transport.verify((error, success) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Ready for message");
        console.log(success);
    }
})
class authController {
    static async register(req, res) {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json("Missing is email!");
        }
        else if (!req.body.password) {
            return res.status(400).json("Missing is password!");
        }
        else if (!req.body.name) {
            return res.status(400).json("Missing is name!");
        }
        const { error } = userValidation(req.body);
        if (error) {
            await logEvents(error.message, module.filename);
            return res.status(400).json("Invalid username, password or email!");
        }
        try {
            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json("User already exists!");
            }
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                name: req.body.name,
                email,
                password: hashed
            });
            const savedUser = await newUser.save();
            if (savedUser._doc) {
                return await authController.sendVerificationEmail(savedUser._doc, res);
            } else {
                return res.status(400).json("Register failed!");
            }
        } catch (error) {
            console.log(error);
            await logEvents(error.message, module.filename);
            return res.status(500).json(error);
        }
    }
    static async sendVerificationEmail(user, res) {
        console.log("Send Mail", user);
        const currentUrl = 'http://localhost:4000/';
        const uniqueString = uuidv4() + user._id;
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: user?.email,
            subject: 'Verification Your Email',
            html: `<p>Verify your email address to complete the resgister and login into your account.</p><p>This is link <b>exprise in 6 hours</b>.</p><p>Press <a href=${currentUrl + "auth/verify/" + user?._id + "/" + uniqueString}>here</a> to proceed.</p>`
        }
        const salt = await bcrypt.genSalt(10);
        const hashedUniqueString = await bcrypt.hash(uniqueString, salt);
        const newVerification = new UserVerification({
            userId: user._id,
            uniqueString: hashedUniqueString,
            createAt: Date.now(),
            expiresAt: Date.now() + 21600000,
        })
        const savedVerification = await newVerification.save();
        if (savedVerification?._doc) {
            const result = await transport.sendMail(mailOptions);
            if (result) {
                return res.status(201).json("Verification email sent successfully!");
            }
        }
        else {
            return res.status(400).json("Verification emai sent failed!");
        }
    }
    static async verifyEmail(req, res) {
        const { userId, uniqueString } = req.params;
        console.log(userId, uniqueString);
        try {
            const userVerification = await UserVerification.findOne({ userId });
            if (!userVerification) {
                const message = "Account record doesn't exist or has been verified already. Please register or log in.";
                return res.redirect(`/auth/verified/error=true&message=${message}`);
            }
            const { expiresAt } = userVerification?._doc;
            const hashedUniqueString = userVerification?._doc?.uniqueString
            if (expiresAt < Date.now()) {
                UserVerification.deleteOne({ userId })
                    .then((result) => {
                        User.deleteOne({ _id: userId }).then((result) => {
                            const message = "Link has expired. Please register again.";
                            return res.redirect(`/auth/verified/error=true&message=${message}`);
                        }).catch((err) => {
                            const message = "Clearing user with expried unique string failed.";
                            return res.redirect(`/auth/verified/error=true&message=${message}`);
                        })
                    })
                    .catch((error) => {
                        const message = "An error occurred while clearing expired user verification record.";
                        return res.redirect(`/auth/verified/error=true&message=${message}`);
                    })
            }
            else {
                const isValidUniqueString = await bcrypt.compare(uniqueString, hashedUniqueString);
                if (!isValidUniqueString) {
                    const message = "An error occurred while compare unique strings";
                    return res.redirect(`/auth/verified/error=true&message=${message}`);
                }
                else {
                    User.updateOne({ _id: userId }, { verified: true }).then(() => {
                        UserVerification.deleteOne({ userId }).then(() => {
                            return res.redirect('/auth/verify');
                        }).catch((error) => {
                            const message = "An error occurred while finalizing successfully verification";
                            return res.redirect(`/auth/verified/error=true&message=${message}`);
                        })
                    })
                        .catch((error) => {
                            const message = "An error occurred while updating user record to show verification";
                            return res.redirect(`/auth/verified/error=true&message=${message}`);
                        })
                }
            }

        } catch (error) {
            console.log(error);
            const message = "An error occurred while checking for existing user verification record.";
            return res.redirect(`/auth/verified/error=true&message=${message}`);
        }
    }
    static async getVerificationPage(req, res) {
        try {
            return res.render('verifiedSuccess.hbs', { title: "Email Verified" });
        } catch (error) {
            console.log(error);
            await logEvents(error.message, module.filename);
            return res.status(500).json(error);
        }
    }
    static async login(req, res) {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json("Missing is email!");
        }
        else if (!req.body.password) {
            return res.status(400).json("Missing is password!");
        }
        const { error } = userLoginValidation(req.body);
        if (error) {
            return res.status(400).json("Invalid username or password!");
        }
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json("User not found!");
            }
            const isValidPassword = await bcrypt.compare(req.body.password, user.password);
            if (!isValidPassword) {
                return res.status(400).json("Password is incorrect!");
            }

            if (user && isValidPassword) {
                const { password, ...others } = user._doc;
                const accessToken = generateAccessToken(user._doc);
                const refreshToken = generateRefreshToken(user._doc);
                const userToken = await UserToken.findOne({ userId: user._id });
                if (!userToken) {
                    const newUserToken = new UserToken({
                        userId: user._doc._id,
                        refreshToken: refreshToken,
                    })
                    await newUserToken.save();
                }
                else {
                    await UserToken.updateOne({ userId: user._id }, { refreshToken: refreshToken });
                }
                if (!user._doc.verified) {
                    return res.status(400).json("Email hasn't been verified yet.Check your inbox!");
                }
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    maxAge: 365 * 24 * 60 * 60 * 60
                })
                return res.status(200).json({ ...others, accessToken });
            }
        } catch (error) {
            console.log(error);
            await logEvents(error.message, module.filename);
            return res.status(500).json(error);
        }
    }
    static async logout(req, res) {
        try {
            const data = await UserToken.deleteOne({ userId: req.user.userId });
            res.clearCookie('refreshToken');
            if (data.deletedCount === 1) {
                return res.status(200).json('Logged out successfully!');
            }
            else {
                return res.status(403).json('Logged out failed!');
            }
        } catch (error) {
            console.log(error);
            await logEvents(error.message, module.filename);
            return res.status(500).json(error);
        }
    }
    static async requestRefreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json("You're not authenticated");
            }
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (error, data) => {
                if (error?.name === 'TokenExpiredError') {
                    return res.status(403).json('Toke is expired!');
                } else if (error) {
                    return res.status(403).json('Toke is not valid!');
                }
                const user = {
                    _id: data.userId
                }
                const newAccessToken = generateAccessToken(user);
                const newRefreshToken = generateRefreshToken(user);

                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    maxAge: 365 * 24 * 60 * 60 * 60
                });
                let message = '';
                const userToken = await UserToken.findOne({ userId: user._id });
                if (userToken) {
                    const data = await UserToken.updateOne({ userId: user._id }, { refreshToken: newRefreshToken });
                    if (data.modifiedCount === 0) {
                        message = "Refresh token failed!";
                    }
                    else {
                        message = "Refresh token successfully!";
                    }
                }
                else {
                    return res.status(404).json("User not found!");
                }
                return res.status(201).json({ message, accessToken: newAccessToken, refreshToken: newRefreshToken });
            })
        } catch (error) {
            console.log(error);
            await logEvents(error.message, module.filename);
            return res.status(500).json(error);
        }
    }
}

module.exports = authController;