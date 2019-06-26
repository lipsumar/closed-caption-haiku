const mongodb = require('mongodb');
const client = mongodb.MongoClient;

class CacheService {

  initialize(){
    return new Promise((resolve, reject) => {
      client.connect(process.env.MONGO_URL, {useNewUrlParser: true}, (err, client) => {
        if (err) {
          console.log('database is not connected')
          reject(err)
        } else {
          const db = client.db('cchaiku')
          this.collection = db.collection('subtitles')
          resolve()
        }
      });
    })
  }

  async has(movieName) {
    const existing = await this.get(movieName)
    return existing ? true : false
  }

  async set(movieName, obj) {
    await this.collection.insertOne({...obj, movieName})
  }

  async get(movieName){
    const existing = await this.collection.findOne({movieName})
    return existing
  }
}

module.exports = CacheService