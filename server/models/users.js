
const bcryt=require("bcrypt")
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
require("dotenv").config();

const user_Schemas=mongoose.Schema({

fullname:{
    type:String,
},
email:{
    type:String,
  
},
password:{
    type:String
},




 photo: {
    type: String,
    default:"string"
},
username:{
    type:String
}
,

groupm:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"institutetable"}
],
task:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"onetimeshedule"
}]
,timetable:
 [ {
        type:mongoose.Schema.Types.ObjectId,
        ref:"regulartable"
    }]
    

,
messages:
[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"messages"
    }
]
,
friends:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
]



},{timestamps:true})





/////////////////////// admin
const Admin_schm=mongoose.Schema({
    firstname:{
        type:String,
        min:4,max:15
    },
    lastname:{
        type:String,
        min:4,max:15
    },
   
    email:{
        type:String,
      
    },
    username:{
        type:String
    },
    password:{
        type:String
    },
  
    photo: {
        type: String,
       
     default:"string"
     
    },
  role:{
      type:String,
      default:"admin"

  },
    
    verified:{
        type:Boolean,
        default:false
    },
    Creator:{
        type:String,
        default:"no"
    }
    
    },{timestamps:true})
    
    
    
    
    
    
    



user_Schemas.pre("save",async function(next){
    const user=this;
    if(user.isModified("password")){
        const salt=await  bcryt.genSalt(10)
        const hash=await bcryt.hash(user.password,salt)
        user.password=hash;
    }
    next()
}  )
//// all methodsss***********************************************************************

user_Schemas.methods.comparepassword= async function(inputpassword){
    const user=this;
    const match= await bcryt.compare(inputpassword,user.password)
    return match
 }


////////////////gmail verify user////////////////
user_Schemas.methods.usergmailverify= function(){
    const user=this;
    const userId={_id:user._id.toHexString()}
    const token= jwt.sign(userId,process.env.DB_SECRET,{expiresIn:"1d"})
return token
}

//////////// generate tokens

 user_Schemas.methods.generate_token= function(){
     const user=this;
     const userId={_id:user._id.toHexString()}
    
     const token= jwt.sign(userId,process.env.DB_SECRET,{expiresIn:"1d"})
return token
 }


///////////////////////////////////////////////admin
Admin_schm.pre("save",async function(next){
    const user=this;
    if(user.isModified("password")){
        const salt=await  bcryt.genSalt(10)
        const hash=await bcryt.hash(user.password,salt)
        user.password=hash;
    }
    next()
}  )
//// all methodsss***********************************************************************

Admin_schm.methods.comparepassword= async function(inputpassword){
    const user=this;
    const match= await bcryt.compare(inputpassword,user.password)
    return match
 }
Admin_schm.methods.generate_token= function(){
    const user=this;
    const userId={_id:user._id.toHexString(),email:user.email}
    const token= jwt.sign(userId,process.env.DB_SECRET,{expiresIn:"1d"})
return token
}
Admin_schm.methods.mailverify= function(){
    const user=this;
    const userId={_id:user._id.toHexString()}
    const token= jwt.sign(userId,process.env.DB_SECRET,{expiresIn:"1d"})
return token
}
/////////////////////////////////

const Admin=mongoose.model("Admin",Admin_schm)
const User=mongoose.model("users",user_Schemas)



module.exports={
    User,Admin
}