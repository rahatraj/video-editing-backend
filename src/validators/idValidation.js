import { param } from 'express-validator'

export const validateIdParam = [
    param('id')
        .isInt({min : 1})
        .withMessage("ID must be positive integer."),
];