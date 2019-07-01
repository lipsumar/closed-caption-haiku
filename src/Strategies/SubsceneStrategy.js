const ScrapSubtitles = require('scrap-subtitles')
const lib = require('../lib')

class SubsceneStrategy{
  constructor(googleApiKey, googleCx){
    this.scrapper = new ScrapSubtitles({googleApiKey, googleCx})
  }

  async findOne(movieName){

    const candidates = await this.scrapper.findCandidates(movieName)
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      console.log('👉 ', candidate.name)
      const srts = await this.scrapper.fetchCandidate(candidate)
      if(!srts) continue
      if(srts.length === 0) continue
      const srtString = srts[0].content

      const lines = lib.parseSrt(srtString)
      console.log(`=> ${lines.length} lines`)
      const hiLines = lib.filterHILines(lines)
      console.log(`=> ${hiLines.length} hiLines`)
      if(hiLines.length >= 3) return srtString
    }

    return null
  }
}

module.exports = SubsceneStrategy