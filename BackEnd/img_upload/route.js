const express=require('express');
const router=express.Router();
const multer=require('multer');
const path = require('path');
const DefaultTable=require('./db')
const storage=multer.diskStorage({
    destination:'./imagess',
    filename:(req,file,cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); // Unique filename
    },
})
const upload=multer({storage:storage})
router.post('/default',upload.single('myImage'),(req,res)=>{
    const newData=new DefaultTable({
        name:req.body.name,
        age:req.body.age,
        option:req.body.option,
    })

    if(req.file){
        newData.image=req.file.filename;
    }
    newData.save();
})
module.exports=router;