const { MongoClient } = require("mongodb");
const dotenv = require("dotenv")
dotenv.config()


const uri = `mongodb+srv://kylie:${process.env.MONGODB_PW}@cluster0.sehaq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log('DB Connection')


module.exports = client