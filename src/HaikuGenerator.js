const sampleSize = require("lodash.samplesize");
const shuffle = require("lodash.shuffle");
const lib = require("./lib");
const syllable = require("syllable");

class HaikuGenerator {
  constructor(cache, subtitleFinder) {
    this.cache = cache;
    this.subtitleFinder = subtitleFinder;
  }

  async getHILines(movieName) {
    if (await this.cache.has(movieName)) {
      console.log("cached!");
      const cached = await this.cache.get(movieName);
      return cached.hiLines;
    }

    const startDate = new Date();
    const result = await this.subtitleFinder.find(movieName);
    if (!result) return null;
    if (!result.srtLines) return null;

    const hiLines = lib.filterHILines(result.srtLines);
    if (hiLines.length === 0) {
      throw new Error("cant find HI subtitles");
    }
    const endDate = new Date();

    await this.cache.set(movieName, {
      hiLines,
      added: new Date().toISOString(),
      totalTimeMs: endDate.getTime() - startDate.getTime(),
      strategy: result.strategy,
    });
    return hiLines;
  }

  async generate(movieName) {
    console.log(`=====> "${movieName}" <=====`);

    const hiLines = await this.getHILines(movieName);

    return this.makeHaikuFromHILines(hiLines);
  }

  makeHaikuFromHILines(hiLines) {
    const cleanLines = hiLines.map((line) => this.cleanHiLine(line));

    // first, try to make a real haiku
    const linesWithSyllable = cleanLines.map((line) => [line, syllable(line)]);
    const linesFive = shuffle(linesWithSyllable.filter((l) => l[1] === 5));
    const linesSeven = shuffle(linesWithSyllable.filter((l) => l[1] === 7));

    if (linesFive.length >= 2 && linesSeven.length >= 1) {
      return {
        real: true,
        fives: linesFive.length,
        sevens: linesSeven.length,
        total: cleanLines.length,
        lines: [linesFive.pop()[0], linesSeven.pop()[0], linesFive.pop()[0]],
      };
    }

    return {
      real: false,
      fives: linesFive.length,
      sevens: linesSeven.length,
      total: cleanLines.length,
      lines: sampleSize(hiLines, 3).map((line) => this.cleanHiLine(line)),
    };
  }

  cleanHiLine(line) {
    return line.substr(1, line.length - 2);
  }
}

module.exports = HaikuGenerator;
