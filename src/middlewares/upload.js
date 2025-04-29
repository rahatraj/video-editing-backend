import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { error } from 'console';

const uploadDir = path.join(process.cwd(), 'uploads/');
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive : true})
}

const storage = multer.diskStorage({
    destination : (req,file,cb) => cb(null, 'uploads/'),
    filename : (req,file,cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
    storage,
    limits : {fileSize : 300 * 1024 * 1024}, // 300MB limmit
    fileFilter : (req, file, cb) => {
        if(file.mimetype !== 'video/mp4'){
            return cb(new Error("Only mp4 files are allowed!", false))
        }
        cb(null, true)
    }
})

export default upload;