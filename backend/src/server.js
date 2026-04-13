import "./env.js"
import app from "./app.js";
import http from 'http' //http is built into Node.js.
import connectDB from "./db/db.js";

const PORT = process.env.PORT || 6000


const server = http.createServer(app)

connectDB()

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
}) //should use this when we are making real time applications like chat apps or live collaborations or video streaming.. 
//because we can later integrate/combine socket.io with this server
//we can have reference so we can have the access to the server obj



// app.get("/", (req,res)=>{
//     res.send("Hello World")
// })

// app.listen(process.env.PORT || 6000 , ()=>{
//     console.log("server is running")
// }) //should use this when we are making simple applications like blogs, e-commerce, social media etc.. because we don't need real time features in these applications.





/*
express → factory function (call it to get app) + has properties like express.json, express.static
app → also a function (pass it to http.createServer) + has methods like app.use, app.listen



GPT's Explanation:

const server = http.createServer(app)
"Create a raw Node HTTP server and use Express as the request handler"

Express is a Factory function (A function that creates and returns an object)

Express is Just a Function : Your app is actually:
(req, res) => { ... }
Yes. Express app is literally a function.

So this:
http.createServer(app)
Is basically:
http.createServer((req, res) => {
   app(req, res)
})

So Node:
Receives request
Passes to Express
Express handles routing
Sends response

Like a traffic officer handing cars to a highway 

Node = road
Express = traffic system


What Happens When You Use app.listen()?
When you write:
app.listen(PORT)
Express secretly does this:

const server = http.createServer(app)
server.listen(PORT)

Express internally uses http.createServer() anyway.

So both approaches end up the same.
But:
Method	                                    Control
app.listen	                                Less control
http.createServer	                        Full control


Professionals Use http.createServer? Why?

Because now you can attach things:

WebSockets
const io = new Server(server)
Server events
server.on("error", ()=>{})
Graceful shutdown
server.close()
Real-time features


Visual Explanation

Without http:
Client → Express → Response

With http:
Client → HTTP Server → Express → Response

added one control layer. Like adding a gate before your house.
More control. More power.

*/