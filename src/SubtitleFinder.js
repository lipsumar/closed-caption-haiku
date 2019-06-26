const SubsceneStrategy = require('./Strategies/SubsceneStrategy')
const OpenSubtitlesStrategy = require('./Strategies/OpenSubtitlesStrategy')
const lib = require('./lib')

class SubtitleFinder {
  constructor(){
    this.strategies = [
      new SubsceneStrategy(process.env.GOOGLE_CUSTOM_SEARCH_API_KEY, process.env.GOOGLE_CX),
      new OpenSubtitlesStrategy()
    ]
  }
  async find(movieName) {
    console.log(`Find "${movieName}"`)
    for(let i=0; i<this.strategies.length; i++){
      const strategy = this.strategies[i]
      console.log(`Strategy #${i} - ${strategy.constructor.name}`)
      let srtString = null
      try{
        srtString = await this.strategies[i].findOne(movieName)
      }catch(err){
        console.log('Strategy error:')
        console.log(err)
        continue
      }
      
      if(srtString){
        console.log('=> FOUND!')
        return {
          srtLines: lib.parseSrt(srtString),
          strategy: strategy.constructor.name
        }
      }
      console.log('=> Not found')
    }
  }
}

module.exports = SubtitleFinder