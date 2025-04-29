import { body } from "express-validator";

export const uploadVideoValidation = [
    body('name')
      .optional()
      .isString()
      .withMessage('Title must be a string'),
  
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
  ];
  
export const trimVideoValidation = [
    body('startTime')
        .exists()
        .withMessage("Start time is required.")
        .isNumeric()
        .withMessage("Start time must be number.")
        .custom((value)=> value >= 0)
        .withMessage("Start time can not be negative."),
    
    body('endTime')
        .exists()
        .withMessage("End time is required.")
        .isNumeric()
        .withMessage("End time must be number.")
        .custom((value, {req}) => {
            if(value <= req.body.startTime){
                throw new Error('End time must be greater than start time.')
            }
            return true;
        }),
];

export const subtitleValidation = [
    body('text')
        .exists()
        .withMessage("Text is required.")
        .isString()
        .withMessage("Text must be string."),
    
    body('startTime')
        .exists()
        .withMessage("StatTime is required.")
        .isNumeric()
        .withMessage("Start time must be number.")
        .custom((value)=> value >=0)
        .withMessage("Start time must be greater than or queal to 0."),

    body('endTime')
        .exists()
        .withMessage('End time is required.')
        .isNumeric()
        .withMessage('end time must be number.')
        .custom((value, {req}) => {
            if( value <= req.body.startTime){
                throw new Error("End time must be greater than start time.")
            }
            return true;
        })
];