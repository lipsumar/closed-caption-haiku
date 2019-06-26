const uniq = require('lodash.uniq')

module.exports = {
  parseSrt(srtString) {
    const all = []
    const lines = srtString.split('\n')
    lines.forEach((line, i) => {
      if (line.match(/[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]+ -->/)) {
        all.push(lines[i + 1].replace(/<\/?[a-z]>/g, '').trim())
      }
    })
    return all
  },

  filterHILines(lines){
    return uniq(lines.filter(l => {
      return (l[0] === '(' && l[l.length-1] === ')') || (l[0] === '[' && l[l.length-1] === ']')
    }))
  }
}