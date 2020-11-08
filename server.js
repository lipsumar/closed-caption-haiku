require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const HaikuGenerator = require("./src/HaikuGenerator");
const CacheService = require("./src/CacheService");
const SubtitleFinder = require("./src/SubtitleFinder");
const haikuImageGenerator = require("./src/haikuImageService");
const consolidate = require("consolidate");
const bodyParser = require("body-parser");
const sample = require("lodash.sample");
let haikuGenerator = null;
let haikuCache = null;

app.use(express.static("./public"));
app.use(bodyParser.json());

// assign the swig engine to .html files
app.engine("html", consolidate.ejs);

// set .html as the default extension
app.set("view engine", "html");
app.set("views", __dirname + "/src/views");

const bgImages = {
  1: [
    "tv-static-1.jpeg",
    "tv-static-2.jpeg",
    "tv-static-3.jpeg",
    "tv-static-4.jpeg",
    "tv-static-5.jpeg",
    "tv-static-6.jpeg",
    "tv-static-7.jpeg",
    "tv-static-8.jpeg",
    "tv-static-9.jpeg",
    "tv-static-10.jpeg",
  ],
  2: [
    "tv-static-11.jpeg",
    "tv-static-12.jpeg",
    "tv-static-13.jpeg",
    "tv-static-14.jpeg",
    "tv-static-15.jpeg",
    "tv-static-16.jpeg",
    "tv-static-17.jpeg",
    "tv-static-18.jpeg",
    "tv-static-19.jpeg",
    "tv-static-20.jpeg",
    "tv-static-21.jpeg",
  ],
};

app.post("/generate-haiku", async (req, res) => {
  const movieName = (req.body.movieName || req.query.movieName)
    .trim()
    .toLowerCase();

  if (!movieName) {
    res.end();
    return;
  }
  let haiku = null;
  try {
    haiku = await haikuGenerator.generate(movieName);
    if (!haiku) {
      res.send({ error: "cant generate haiku for this one" });
      return;
    }

    haiku.lines = haiku.lines.map((l) => `[${l}]`);
    const bg = Math.random() > 0.5 ? 1 : 2;
    const backgroundImage = sample(bgImages[bg]);
    const id = await haikuImageGenerator(haiku.lines, {
      background: backgroundImage,
    });

    haikuCache.set(id, {
      haiku,
      movie: movieName,
      createdAt: new Date().toISOString(),
      bg,
      backgroundImage,
    });
    res.send({ id });
    //res.redirect(`/haiku/${id}`);
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err);
  }
});

app.get("/haiku/:id", async (req, res) => {
  const id = req.params.id;
  const haiku = await haikuCache.get(id);
  res.render("haiku.ejs", {
    imageUrl: `/haiku-images/${id}.jpg`,
    haiku,
  });
});

async function start() {
  console.log("Starting...");

  const cacheService = new CacheService();
  await cacheService.initialize("subtitles");
  const subtitleFinder = new SubtitleFinder();

  haikuGenerator = new HaikuGenerator(cacheService, subtitleFinder);

  haikuCache = new CacheService();
  await haikuCache.initialize("haikus");

  app.listen(PORT, () => {
    console.log(`Ready, listening on ${PORT}`);
  });
}

start();
