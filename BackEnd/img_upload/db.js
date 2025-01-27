const mongoose=require('mongoose')
const DeafaultTable=mongoose.model('default',{
    name:String,
    age:String,
    option:String,
    myImage:String,
})

module.exports=DeafaultTable;