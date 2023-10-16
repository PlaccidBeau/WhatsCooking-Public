const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const mongSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const asyncHandler = require("express-async-handler");

//local
const dbURL = "mongodb://localhost:27017/cook";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbURL);
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("pulic"));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));
app.use(
  mongSanitize({
    replaceWith: "_",
  })
);

app.get("/home", async (req, res) => {
  res.send("Hello hello");
});

//Bottom
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
