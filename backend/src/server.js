import "./env.js"
import app from "./app.js";

app.get("/", (req,res)=>{
    res.send("Hello World")
})

app.listen(process.env.PORT || 6000 , ()=>{
    console.log("server is running")
})