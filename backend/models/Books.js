const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BookSchema = new schema({
  title: {
    type: String,
    // required: true,
  },
  slug: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  thumbnail: {
    type: String,
    // required: true,
  },
  stars: {
    type: Number,
    // required: true,
  },
  category: {
    type: Array,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Book", BookSchema);
