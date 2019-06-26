require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

const HaikuGenerator = require('./src/HaikuGenerator')
const CacheService = require('./src/CacheService')
const SubtitleFinder = require('./src/SubtitleFinder')

let haikuGenerator = null

app.use(express.static('./public'))

app.post('/generate-haiku', async (req, res) => {
  const movieName = req.query.movieName.trim().toLowerCase()
  let haiku = null
  try{
    haiku = await haikuGenerator.generate(movieName)
    if(haiku){
      res.send({haiku})
    }else{
      res.send({error: 'cant generate haiku for this one'})
    }
    
  }catch(err){
    res.status(500).send(err.message)
    console.log(err)
  }
})

async function start(){

  console.log('Starting...')

  const cacheService = new CacheService()
  await cacheService.initialize()
  const subtitleFinder = new SubtitleFinder()

  haikuGenerator = new HaikuGenerator(cacheService, subtitleFinder)

  app.listen(PORT, () => {
    console.log(`Ready, listening on ${PORT}`)
  })
}

start()

