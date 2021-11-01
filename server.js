const Koa = require("koa")
const Pug = require("koa-pug")
const path = require("path")

const app = new Koa();
const PORT = 5001 

new Pug({
    viewPath: path.resolve(__dirname, './views'),
    app // Binding `ctx.render()`, equals to pug.use(app)
  })



app.use(async ctx => {
    await ctx.render('index')
  });


app.listen(PORT,()=>{
    console.log(`KOA SERVER CONNETION http://localhost:${PORT}`)})