const Koa = require("koa")
const websockify = require('koa-websocket');
const route = require('koa-route')
const serve = require('koa-static')
const mount = require('koa-mount')
const Pug = require("koa-pug")
const path = require("path")



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

  // Using routes
  app.ws.use(route.all('/ws',(ctx)=> {
    // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
    // the websocket is added to the context on `ctx.websocket`.
    ctx.websocket.send('Hello World');

    // [Recive] The message from user
    ctx.websocket.on('message', (data)=> {
      if(typeof data !== 'string') return 
      
      const {message,nickname} = JSON.parse(data)

      const {server} = app.ws
      if(!server) return


      // [Send] the useres' message from server to ALL client
      server.clients.forEach(client =>{
        client.send(JSON.stringify({
          message,nickname
        }))
      })
    });


  }));  


app.listen(PORT,()=>{
    console.log(`KOA SERVER CONNETION http://localhost:${PORT}`)})