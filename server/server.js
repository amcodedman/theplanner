const express=require("express")
const mongoose=require("mongoose")
const app=express()
require("dotenv").config()
const bodyParser=require("body-parser")
const cookieParser=require("cookie-parser")
const PORT=process.env.PORT ||3003
const path=require("path")
var cors = require('cors')
const MongoUrl=`mongodb+srv://timenudgemcommunity:${process.env.DB_PASS}@timenudge.ypp9h2p.mongodb.net/`


const Admin=require("./routers/Admin")

const users=require("./routers/users")
const geo=require("./routers/geo")
const database=require("./routers/databa")
app.use(cors())
const {checkToken}=require("./middleware/auth")
app.use(bodyParser.json())
app.use(cookieParser())

app.use(checkToken)

/// middlewares
app.use("/admin",Admin)
app.use("/user",users)


app.use("/ipaddress",geo)
app.use("/data/",database)







const DBconnect =async () => {
    try {
        console.log("Starting")
        mongoose.set('strictQuery', false)
        mongoose.connect(MongoUrl) 
        console.log('Mongo connected')
    } catch(error) {
        console.log(error)
        process.exit()
    }
}
DBconnect()


app.listen(PORT,(er,res)=>{
    if(er){
        console.log("express not connected")
    }
    
        console.log(`express server running on ${PORT} `)
    
})

app.use(express.static("client/build"));

if(process.env.NODE_ENV==="production"){
    const path=require("path");
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));

    });

}

console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
