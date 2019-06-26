const ScrapSubtitles = require('scrap-subtitles')

class SubsceneStrategy{
  constructor(googleApiKey, googleCx){
    this.scrapper = new ScrapSubtitles({googleApiKey, googleCx})
  }

  async findOne(movieName){
    let srts = null
    try{
      srts = await this.scrapper.find(movieName)
    }catch(err){
      console.log('scrap-subtitles error:', err.message)
      console.log(err.stack)
      return null
    }
    
    if(srts.length === 0) return null
    return srts[0].content
  }
}

module.exports = SubsceneStrategy