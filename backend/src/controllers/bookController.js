import mongoose from "mongoose";
import Book from "../models/Book.js";
import {
    successResponse,
    errorResponse
} from "../utils/response.js";
import { sanitizeBookInput } from "../utils/sanitize.js";

/*
|--------------------------------------------------------------------------
| GET ALL BOOKS
|--------------------------------------------------------------------------
*/

const getBooks = async (req, res, next) => {
    try {
        const {
            search = "",
            category = "",
            status = "",
            page = 1,
            limit = 10
        } = req.query;

        const currentPage = Math.max(
            Number(page) || 1,
            1
        );

        const pageLimit = Math.min(
            Math.max(Number(limit) || 10, 1),
            100
        );

        const filter = {};

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if (search.trim()) {
            const safeSearch = search.trim();

            filter.$or = [
                {
                    title: {
                        $regex: safeSearch,
                        $options: "i"
                    }
                },
                {
                    author: {
                        $regex: safeSearch,
                        $options: "i"
                    }
                },
                {
                    isbn: {
                        $regex: safeSearch,
                        $options: "i"
                    }
                }
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Category
        |--------------------------------------------------------------------------
        */

        if (category.trim()) {
            filter.category = category.trim();
        }

        /*
        |--------------------------------------------------------------------------
        | Availability Filters
        |--------------------------------------------------------------------------
        */

        if (status === "Available") {
            filter.availableQuantity = {
                $gt: 5
            };
        }

        if (status === "Low Stock") {
            filter.availableQuantity = {
                $gt: 0,
                $lte: 5
            };
        }

        if (status === "Out of Stock") {
            filter.availableQuantity = 0;
        }

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        const skip =
            (currentPage - 1) * pageLimit;

        const [books, total] =
            await Promise.all([
                Book.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(pageLimit),

                Book.countDocuments(filter)
            ]);

        const totalPages =
            total === 0
                ? 0
                : Math.ceil(
                    total / pageLimit
                );

        return successResponse(
            res,
            200,
            books.length
                ? "Books fetched successfully"
                : "No data found",
            books,
            {
                pagination: {
                    page: currentPage,
                    limit: pageLimit,
                    total,
                    totalPages
                }
            }
        );
    } catch (error) {
        next(error);
    }
};


/*
|--------------------------------------------------------------------------
| GET BOOK BY ID
|--------------------------------------------------------------------------
*/

const getBookById = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return errorResponse(
                res,
                400,
                "Invalid book ID"
            );
        }

        const book =
            await Book.findById(id);

        if (!book) {
            return errorResponse(
                res,
                404,
                "Book not found"
            );
        }

        return successResponse(
            res,
            200,
            "Book fetched successfully",
            book
        );
    } catch (error) {
        next(error);
    }
};


/*
|--------------------------------------------------------------------------
| CREATE BOOK
|--------------------------------------------------------------------------
*/

const createBook = async (
    req,
    res,
    next
) => {
    try {
        const sanitizedData =
            sanitizeBookInput(req.body);

        /*
        |--------------------------------------------------------------------------
        | Validate quantity relationship
        |--------------------------------------------------------------------------
        */

        const quantity =
            Number(sanitizedData.quantity);

        const availableQuantity =
            Number(
                sanitizedData.availableQuantity
            );

        if (
            Number.isNaN(quantity) ||
            Number.isNaN(availableQuantity)
        ) {
            return errorResponse(
                res,
                400,
                "Quantity values must be valid numbers"
            );
        }

        if (
            quantity < 0 ||
            availableQuantity < 0
        ) {
            return errorResponse(
                res,
                400,
                "Quantity values cannot be negative"
            );
        }

        if (
            availableQuantity > quantity
        ) {
            return errorResponse(
                res,
                400,
                "Available quantity cannot exceed total quantity"
            );
        }

        const book =
            await Book.create({
                ...sanitizedData,
                quantity,
                availableQuantity
            });

        console.log(
            "[Analytics] User interacted with Express API"
        );

        return successResponse(
            res,
            201,
            "Book created successfully",
            book
        );
    } catch (error) {
        if (error.code === 11000) {
            return errorResponse(
                res,
                409,
                "A book with this ISBN already exists"
            );
        }

        next(error);
    }
};


/*
|--------------------------------------------------------------------------
| UPDATE BOOK
|--------------------------------------------------------------------------
*/

const updateBook = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return errorResponse(
                res,
                400,
                "Invalid book ID"
            );
        }

        const sanitizedData =
            sanitizeBookInput(req.body);

        const quantity =
            Number(sanitizedData.quantity);

        const availableQuantity =
            Number(
                sanitizedData.availableQuantity
            );

        if (
            Number.isNaN(quantity) ||
            Number.isNaN(availableQuantity)
        ) {
            return errorResponse(
                res,
                400,
                "Quantity values must be valid numbers"
            );
        }

        if (
            quantity < 0 ||
            availableQuantity < 0
        ) {
            return errorResponse(
                res,
                400,
                "Quantity values cannot be negative"
            );
        }

        if (
            availableQuantity > quantity
        ) {
            return errorResponse(
                res,
                400,
                "Available quantity cannot exceed total quantity"
            );
        }

        const book =
            await Book.findByIdAndUpdate(
                id,
                {
                    ...sanitizedData,
                    quantity,
                    availableQuantity
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!book) {
            return errorResponse(
                res,
                404,
                "Book not found"
            );
        }

        console.log(
            "[Analytics] User interacted with Express API"
        );

        return successResponse(
            res,
            200,
            "Book updated successfully",
            book
        );
    } catch (error) {
        if (error.code === 11000) {
            return errorResponse(
                res,
                409,
                "A book with this ISBN already exists"
            );
        }

        next(error);
    }
};


/*
|--------------------------------------------------------------------------
| DELETE BOOK
|--------------------------------------------------------------------------
*/

const deleteBook = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return errorResponse(
                res,
                400,
                "Invalid book ID"
            );
        }

        const book =
            await Book.findByIdAndDelete(id);

        if (!book) {
            return errorResponse(
                res,
                404,
                "Book not found"
            );
        }

        console.log(
            "[Analytics] User interacted with Express API"
        );

        return successResponse(
            res,
            200,
            "Book deleted successfully",
            book
        );
    } catch (error) {
        next(error);
    }
};


/*
|--------------------------------------------------------------------------
| GET DASHBOARD STATISTICS
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| totalTitles       = number of different books
| totalQuantity     = total physical copies
| availableQuantity = copies currently available
| borrowedQuantity  = total copies - available copies
|
|--------------------------------------------------------------------------
*/

const getStats = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await Book.aggregate([
                {
                    $group: {
                        _id: null,

                        totalTitles: {
                            $sum: 1
                        },

                        totalQuantity: {
                            $sum: {
                                $ifNull: [
                                    "$quantity",
                                    0
                                ]
                            }
                        },

                        availableQuantity: {
                            $sum: {
                                $ifNull: [
                                    "$availableQuantity",
                                    0
                                ]
                            }
                        }
                    }
                }
            ]);

        const summary =
            result[0] || {
                totalTitles: 0,
                totalQuantity: 0,
                availableQuantity: 0
            };

        const totalTitles =
            Number(
                summary.totalTitles || 0
            );

        const totalQuantity =
            Number(
                summary.totalQuantity || 0
            );

        const availableQuantity =
            Number(
                summary.availableQuantity || 0
            );

        const borrowedQuantity =
            Math.max(
                totalQuantity -
                    availableQuantity,
                0
            );

        /*
        |--------------------------------------------------------------------------
        | Additional inventory status counts
        |--------------------------------------------------------------------------
        */

        const [
            lowStock,
            outOfStock
        ] = await Promise.all([
            Book.countDocuments({
                availableQuantity: {
                    $gt: 0,
                    $lte: 5
                }
            }),

            Book.countDocuments({
                availableQuantity: 0
            })
        ]);

        return successResponse(
            res,
            200,
            "Statistics fetched successfully",
            {
                totalTitles,
                totalQuantity,
                availableQuantity,
                borrowedQuantity,
                lowStock,
                outOfStock
            }
        );
    } catch (error) {
        console.error(
            "Stats error:",
            error
        );

        next(error);
    }
};


/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

export {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getStats
};