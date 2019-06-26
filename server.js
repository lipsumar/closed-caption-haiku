require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

const HaikuGenerator = require('./src/HaikuGenerator')
const CacheService = require('./src/CacheService')
const SubtitleFinder = require('./src/SubtitleFinder')

const cacheService = new CacheService()
const subtitleFinder = new SubtitleFinder()

const haikuGenerator = new HaikuGenerator(cacheService, subtitleFinder)


app.post('/generate-haiku', async (req, res) => {
  const movieName = req.query.movieName
  let haiku = null
  try{
    haiku = await haikuGenerator.generate(movieName)
    res.send(haiku || {error: 'cant generate haiku for this one'})
  }catch(err){
    res.status(500).send(err.message)
    console.log(err)
  }
})

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})