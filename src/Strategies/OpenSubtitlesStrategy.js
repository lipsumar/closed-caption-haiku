const OS = require('opensubtitles-api');
const lib = require('../lib')
const axios = require('axios')

class OpenSubtitlesStrategy {
  constructor() {
    this.openSubtitles = new OS({
      useragent: 'TemporaryUserAgent',
      ssl: true
    });
  }

  async findOne(movieName){
    const searchResult = await this.openSubtitles.search({
      sublanguageid: 'eng', // Can be an array.join, 'all', or be omitted.
      extensions: ['srt'],
      limit: 10,
      //season: 1,
      //episode: 6,
      query: movieName, // Text-based query, this is not recommended.
      //gzip: true // returns url to gzipped subtitles, defaults to false
    })
    
    if(!searchResult || !searchResult.en){
      throw new Error('not found')
    }

    const entries = searchResult.en
  
    let current = null
    // eslint-disable-next-line no-constant-condition
    while(true){
      current = entries.shift()
      if(!current) return null

      console.log('try', current.filename)
      const srtString = await this.getUrlContent(current.url)
      const lines = lib.parseSrt(srtString)
      console.log(`=> ${lines.length} lines`)
      const hiLines = lib.filterHILines(lines)
      console.log(`=> ${hiLines.length} hiLines`)
      if(hiLines.length >= 3) return srtString
    }


  }

  async getUrlContent(url){
    const resp = await axios.get(url)
    return resp.data
  }

}

module.exports = OpenSubtitlesStrategy