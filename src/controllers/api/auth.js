const express = require("express");
const jwt = require("jsonwebtoken");

const { userService, notificationService } = require("../../services/");
const createError = require("http-errors");
const { param } = require("express-validator");
const {
  verify,
  wrapAsync,
  findUser,
  hasValidationErr
} = require("../../middlewares/");
const authRouter = express.Router();

const createUser = wrapAsync(async (req, res) => {
  const { email, password } = req.body;

  userService.validate({ email, password });
  const hash = await userService.encrypt(password);

  try {
    const savedUser = await userService.saveUserWith(email, hash);

    userService.createTokenFor(savedUser);

    const jwtoken = jwt.sign({ _id: savedUser.id }, process.env.TOKEN_SECRET, {
      expiresIn: "330h"
    });

    await notificationService.createNotification(
      {
        receiver: savedUser._id,
        title: "email verification",
        message: "you need to verify your email"
      },
      savedUser
    );

    res.json({
      jwtoken
    });
  } catch (err) {
    throw createError(422, { message: "wrong email or password" });
  }
});

const loginUser = wrapAsync(async (req, res) => {
  const { password } = req.body;
  const { user } = res.locals;

  if (!user) {
    throw createError(422, { message: "wrong email or password" });
  } else {
    const isCorrect = await userService.compare(password, user.hash);

    if (isCorrect) {
      const jwtoken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: "330h"
      });

      res.status(201).json({ jwtoken });
    } else {
      throw createError(422, { message: "wrong email or password" });
    }
  }
});

const resetUsersPassword = wrapAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    const { user } = res.locals;

    userService.createResetTokenFor(user);

    return res.status(201).json({
      message: "we sent mail on your email to reset password"
    });
  }

  const foundToken = await userService.findToken(token).catch(err => {
    throw err;
  });

  const user = await userService.findUserBy(foundToken._userId);

  if (foundToken) {
    await userService.updateUser({ password }, user);
    res.json({ message: "password updated" });
    userService.removeToken(foundToken);
  } else {
    res.json({ message: "erde" });
  }
});

const verifyUser = wrapAsync(async (req, res) => {
  const { token } = req.params;

  const { user } = res.locals;

  const foundToken = await userService.findToken(token).catch(err => {
    throw err;
  });

  if (foundToken) {
    await userService.updateUser({ isVerified: true }, user);
    res.json({ message: "you're email was verified" });
    userService.removeToken(foundToken);
  } else {
    res.json({ message: "token not found" });
  }
});

authRouter.use(["/login", "/reset-password/"], findUser.byEmail);

authRouter.use(
  "/verify/:token",
  param("token").exists(),
  hasValidationErr,
  verify,
  findUser.byId
);

authRouter.post("/register", createUser);

authRouter.post("/login", loginUser);

authRouter.put("/reset-password/:token", resetUsersPassword);

authRouter.put("/verify/:token", verifyUser);

module.exports = authRouter;
