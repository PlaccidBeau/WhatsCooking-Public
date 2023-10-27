const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const helmet = require("helmet");
const methodOverride = require("method-override");
const mongSanitize = require("express-mongo-sanitize");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const morgan = require("morgan");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");

const expressError = require("./Utilities/ExpressError");
const recipeRoute = require("./routes/recipe");
const reviewRoute = require("./routes/review");
const userRoutes = require("./routes/user");
const User = require("./models/user");

//secret file is my dotenv file holding my mongodb connect string and cloudinary api keys
const secret = require("./secret");
const dbURL = secret.DB_URL || "mongodb://localhost:27017/cook";
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbURL);
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));
app.use(
  mongSanitize({
    replaceWith: "_",
  })
);
const store = MongoStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: "thisshouldbeabettersecret!",
  },
});

store.on("error", function (e) {
  console.log("Session Store Error");
});

const sessionConfig = {
  store,
  name: "orion",
  secret: "This is a secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/recipes", recipeRoute);
app.use("/", reviewRoute);
app.get("/", (req, res) => {
  res.render("recipe/home");
});

app.all("*", (req, res, next) => {
  next(new expressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
