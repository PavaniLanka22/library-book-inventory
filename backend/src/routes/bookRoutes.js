import express from "express";
import {
    body,
    param,
    validationResult
} from "express-validator";

import {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getStats
} from "../controllers/bookController.js";

const router = express.Router();

const handleValidationErrors = (
    req,
    res,
    next
) => {
    const errors =
        validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid input. Please correct the highlighted fields.",
            data: errors.array().map(
                (error) => ({
                    field: error.path,
                    message: error.msg
                })
            )
        });
    }

    next();
};

const bookValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 150 })
        .withMessage(
            "Title must be 150 characters or less"
        ),

    body("author")
        .trim()
        .notEmpty()
        .withMessage("Author is required")
        .isLength({ max: 100 })
        .withMessage(
            "Author must be 100 characters or less"
        ),

    body("isbn")
        .trim()
        .notEmpty()
        .withMessage("ISBN is required")
        .isLength({ max: 30 })
        .withMessage(
            "ISBN must be 30 characters or less"
        ),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .isLength({ max: 50 })
        .withMessage(
            "Category must be 50 characters or less"
        ),

    body("quantity")
        .isInt({ min: 0 })
        .withMessage(
            "Quantity must be a non-negative integer"
        ),

    body("availableQuantity")
        .isInt({ min: 0 })
        .withMessage(
            "Available quantity must be a non-negative integer"
        )
        .custom(
            (
                availableQuantity,
                { req }
            ) => {
                if (
                    Number(
                        availableQuantity
                    ) >
                    Number(
                        req.body.quantity
                    )
                ) {
                    throw new Error(
                        "Available quantity cannot exceed total quantity"
                    );
                }

                return true;
            }
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Description must be 500 characters or less"
        )
];

const idValidation = [
    param("id")
        .isMongoId()
        .withMessage(
            "Invalid book ID"
        )
];

router.get(
    "/",
    getBooks
);

router.get(
    "/stats",
    getStats
);

router.get(
    "/:id",
    idValidation,
    handleValidationErrors,
    getBookById
);

router.post(
    "/",
    bookValidation,
    handleValidationErrors,
    createBook
);

router.put(
    "/:id",
    [
        ...idValidation,
        ...bookValidation
    ],
    handleValidationErrors,
    updateBook
);

router.delete(
    "/:id",
    idValidation,
    handleValidationErrors,
    deleteBook
);

export default router;