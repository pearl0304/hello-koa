import Koa from "koa"
import Pug from "koa-pug"
import path from "path"
const __dirname = path.resolve()
const app = new Koa();
const PORT = 5001 

app.use(async (ctx)=>{
    ctx.body = 'hello KOA!'

})


new Pug({
    viewPath: path.resolve(__dirname, './views'),
    app
  })






app.listen(PORT,()=>{
    console.log(`KOA SERVER CONNETION http://localhost:${PORT}`)})