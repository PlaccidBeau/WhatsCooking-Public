const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("../models/review");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const RecipeSchema = new Schema({
  title: String,
  ingredients: String,
  directions: String,
  description: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

RecipeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Recipe", RecipeSchema);
