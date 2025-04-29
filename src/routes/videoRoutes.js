import {Router} from 'express'
import upload from '../middlewares/upload.js';
import videoCltr from '../controllers/video.controller.js';
import { validateIdParam } from '../validators/idValidation.js';
import { subtitleValidation, trimVideoValidation } from '../validators/videoValidation.js';
import { validationResult } from 'express-validator';

const router = Router();

// middleware function 

const handleValidationErrors = (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    next();
}

router.post("/upload", 
    upload.single('video'), 
    videoCltr.upload
)

router.post("/:id/trim", 
    validateIdParam,
    trimVideoValidation,
    handleValidationErrors,
    videoCltr.trim
)

router.post("/:id/addsubtitle",
    validateIdParam,
    subtitleValidation,
    handleValidationErrors,
    videoCltr.addSubtitle
)

router.post("/:id/render",
    validateIdParam,
    handleValidationErrors,
    videoCltr.render
)

router.get("/:id/download",
    validateIdParam,
    handleValidationErrors,
    videoCltr.download
)

router.get("/",
    videoCltr.list
)

router.get("/:id",
    validateIdParam,
    handleValidationErrors,
    videoCltr.details
)

export default router;