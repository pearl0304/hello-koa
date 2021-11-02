const Koa = require("koa")
const websockify = require('koa-websocket');
const route = require('koa-route')
const serve = require('koa-static')
const mount = require('koa-mount')
const Pug = require("koa-pug")
const path = require("path")
const mongoClient = require("./mongoDB/mongo");
const client = require("./mongoDB/mongo");



const app = websockify(new Koa());
const PORT = 5001 

new Pug({
    viewPath: path.resolve(__dirname, './views'),
    app // Binding `ctx.render()`, equals to pug.use(app)
  })

app.use(mount('/public',serve('src/public')))


app.use(async ctx => {
    await ctx.render('index')
  });


// mongoDB
const _client = mongoClient.connect()

async function getChatsCollection(){
  const client = await _client
  return client.db('test').collection('chats')
}

// Using routes
app.ws.use(route.all('/ws',async (ctx)=> {

  // Rendering exited chat message
  const chatsCollection = await getChatsCollection()
  const chatsCursor = chatsCollection.find({},{sort:{createdAt:1}})

  const chats = await chatsCursor.toArray()
  ctx.websocket.send(JSON.stringify({
    type : 'sync',
    payload : {chats}
  }))

  // [Recive] The message from user
  ctx.websocket.on('message', async(data)=> {
    if(typeof data !== 'string') return 

    const chat = JSON.parse(data) 

    await chatsCollection.insertOne({
      ...chat,
      createdAt: new Date()
    })

    const {message,nickname} = chat

    const {server} = app.ws
    if(!server) return


    // [Send] the useres' message from server to ALL client
    server.clients.forEach(client =>{
      client.send(JSON.stringify({
        type : 'chat',
        payload : {
          message,
          nickname
        }
     
      }))
    })
  });


}));  


app.listen(PORT,()=>{
    console.log(`KOA SERVER CONNETION http://localhost:${PORT}`)})