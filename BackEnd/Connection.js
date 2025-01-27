const mongoose=require("mongoose");
const connect=mongoose.connect("'mongodb+srv://dineshkumar:dinesh@cluster0.mysx0.mongodb.net/yourDatabaseName'")
.then(()=>{
    console.log("Mongo DB Connected");
}).catch((err)=>{
    console.log(err.name);
})
module.exports=connect;