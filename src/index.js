const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const yup = require("yup");
const monk = require("monk");
const { nanoid } = require("nanoid");

require("dotenv").config();

const db = monk(process.env.MONGODB_URI);
const urls = db.get("urls");
urls.createIndex({ slug: 1 }, { unique: true });

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

//app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/", async (req, res) => {
  return res.json({ blindas: "?XD" });
});

app.get("/:id", async (req, res) => {
  const { id: slug } = req.params;
  try {
    const url = await urls.findOne({ slug });
    if (url) {
      res.redirect(url.url);
    }
    res.redirect(`/?error=${slug} not found`);
  } catch (error) {
    res.redirect(`/?error=Link not found`);
  }
});

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/[a-z0-9_\-]/i),
  url: yup.string().trim().url().required(),
});

app.post("/url", async (req, res, next) => {
  let { slug, url } = req.body;
  try {
    await schema.validate({ slug, url });

    if (!slug) {
      slug = nanoid(5);
    } else {
      const slugExists = await urls.findOne({ slug });
      if (slugExists) {
        throw new Error("Slug in use");
      }
    }
    slug = slug.toLowerCase();

    const newUrl = {
      url,
      slug,
    };

    const created = await urls.insert(newUrl);

    res.json(newUrl);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "?XD" : error.stack,
  });
});

app.get("/url/:id", (req, res) => {
  // TODO: get a shor url by id
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Listening at ${port}`);
});
