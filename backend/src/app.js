import express from "express";
import cookieparser from "cookie-parser"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser())





                    //ROUTES

// app.use("/api/v1", (req,res)=>{
//     res.send("HELLO")
// })

import router from "./routes/route.js"

app.use("/api/v1", router)

export default app