const multer=require('multer');
const {v4:uuidv4}=require('uuid');
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads');
    },
    filename:(req,file,cb)=>{
        const uniqueFilename=uuidv4();
        cb(null,uniqueFilename);
    }
});
const upload=multer({storage:storage});
module.exports=upload;