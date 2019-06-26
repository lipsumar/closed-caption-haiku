const sampleSize = require('lodash.samplesize');
const lib = require('./lib')

class HaikuGenerator{
  constructor(cache, subtitleFinder){
    this.cache = cache
    this.subtitleFinder = subtitleFinder
  }

  async generate(movieName){
    if(this.cache.has(movieName)){
      return this.makeHaikuFromHILines(await this.cache.get(movieName))
    }

    const subtitleLines = await this.subtitleFinder.find(movieName)
    if(!subtitleLines) return null

    const hiLines = lib.filterHILines(subtitleLines)
    if(hiLines.length === 0){
      throw new Error('cant find HI subtitles')
    }

    await this.cache.set(movieName, hiLines)
    return this.makeHaikuFromHILines(hiLines)
  }

  makeHaikuFromHILines(hiLines){
    return sampleSize(hiLines, 4)
  }
}

module.exports = HaikuGenerator