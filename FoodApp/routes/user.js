const express = require("express");
const router = express.Router();
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("user/register");
});
//find a better way of erroring repeat email register attempts
router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome new user");
        res.redirect("/recipes");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back");
    const redirectUrl = res.locals.returnTo || "/recipes";
    res.redirect(redirectUrl);
  }
);
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/recipes");
  });
});

module.exports = router;
