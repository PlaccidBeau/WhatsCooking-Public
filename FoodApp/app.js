const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const mongSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const expressError = require("./Utilities/ExpressError");
const asyncHandler = require("express-async-handler");
const Recipe = require("./models/recipe");

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

// app.get("/home", async (req, res) => {
//   res.send("Hello hello");
// });
app.get("/firstrecipe", async (req, res) => {
  const recipe = new Recipe({
    title: "Oatmeal and eggs",
    description:
      "Hearty breakfast with complex carbs, good amount of protein, great way to start the day",
    ingredients:
      "Oatmeal, Cinnamon, Brown sugar, Eggs, Egg whites (optional), Cheese",

    directions:
      "Bring water to a boil, Add oatmeal, cinnamon, and brown sugar to a bowl and mix. Pour water onto the oatmeal stir until combined then set aside to thicken. In a seperate bowl beat eggs and egg whites. Add cheese and mix lightly. Add to a heated pan and scramble. Add scrambled eggs to the outmeal and enjoy",
  });
  await recipe.save();
  res.send(recipe);
});

app.get("/recipes", async (req, res) => {
  const recipes = await Recipe.find();
  res.render("recipe/index", { recipes });
});

//Add new recipe
app.get("/recipes/new", (req, res) => {
  res.render("recipe/new");
});

app.post("/recipes/new", async (req, res) => {
  const recipe = new Recipe(req.body.recipe);
  await recipe.save();
  res.redirect(`/recipes/${recipe._id}`);
});

app.get(
  "/recipes/:id",
  asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    res.render("recipe/show", { recipe });
  })
);

app.get(
  "/recipes/:id/edit",
  asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    res.render("recipe/edit", { recipe });
  })
);
app.put(
  "/recipes/:id/",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndUpdate(id, {
      ...req.body.recipe,
    });
    res.redirect(`/recipes/${recipe._id}`);
  })
);

app.delete(
  "/recipes/:id/",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Recipe.findByIdAndDelete(id);
    res.redirect("/recipes");
  })
);

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
