const sampleSize = require('lodash.samplesize');
const lib = require('./lib')

class HaikuGenerator {
  constructor(cache, subtitleFinder) {
    this.cache = cache
    this.subtitleFinder = subtitleFinder
  }

  async generate(movieName) {
    console.log(`=====> "${movieName}" <=====`)
    if (await this.cache.has(movieName)) {
      console.log('cached!')
      const cached = await this.cache.get(movieName)
      return this.makeHaikuFromHILines(cached.hiLines)
    }

    const startDate = new Date()
    const result = await this.subtitleFinder.find(movieName)
    if (!result.srtLines) return null

    const hiLines = lib.filterHILines(result.srtLines)
    if (hiLines.length === 0) {
      throw new Error('cant find HI subtitles')
    }
    const endDate = new Date()

    await this.cache.set(movieName, { 
      hiLines, 
      added: (new Date()).toISOString(),
      totalTimeMs: endDate.getTime() - startDate.getTime(),
      strategy: result.strategy
    })
    return this.makeHaikuFromHILines(hiLines)
  }

  makeHaikuFromHILines(hiLines) {
    return sampleSize(hiLines, 4)
  }
}

module.exports = HaikuGenerator