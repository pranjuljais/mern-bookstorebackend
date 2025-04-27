require("dotenv").config();
const path = require("path");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const db = require("./connecton");
const book = require("./models/Books");
const app = express();
const PORT = process.env.PORT || 8000;

db();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/api/books", async (req, res) => {
  try {
    const category = req.query.category;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    const data = await book.find(filter);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "An error occured while fetching books in api boooks -1 ",
    });
  }
});

app.get("/api/books/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const data = await book.findOne({ slug: slug });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "An error occured while fetching books in api boooks -1 ",
    });
  }
});

app.get("/api/download/:slug", (req, res) => {
  const slug = req.params.slug;
  const fileName = `${slug}.pdf`;
  const filePath = path.join(__dirname, "pdfs", fileName); // pdfs folder should be in root

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error while downloading file:", err);
      res.status(500).send("Something went wrong while downloading");
    }
  });
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    ); // ✅ Fixed invalid filename error
  },
});

const upload = multer({ storage: fileStorage });

app.post("/api/books", upload.single("thumbnail"), async (req, res) => {
  try {
    const newBook = new book({
      title: req.body.title,
      slug: req.body.slug,
      stars: req.body.stars,
      description: req.body.description,
      category: req.body.category,

      thumbnail: req.file.filename,
    });

    await book.create(newBook);
    res.json("submitted");
  } catch (error) {
    res.status(500).json({
      error: "An error occured while fetching books in api boooks -1 ",
    });
  }
});

app.put("/api/books", upload.single("thumbnail"), async (req, res) => {
  try {
    const bookId = req.body.bookid;
    console.log(bookId);
    const updateBook = {
      title: req.body.title,
      slug: req.body.slug,
      stars: req.body.stars,
      description: req.body.description,
      category: req.body.category,
    };

    if (req.file) {
      updateBook.thumbnail = req.file.filename;
    }

    await book.findOneAndUpdate({ _id: bookId }, updateBook);

    res.json("submitted");
  } catch (error) {
    res.status(500).json({
      error: "An error occured while fetching books in api boooks -1 ",
    });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  const bookid = req.params.id;

  try {
    await book.deleteOne({ _id: bookid });
    res.json("deleted");
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port : ${PORT}`);
});
