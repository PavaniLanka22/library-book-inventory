import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 150
        },

        author: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100
        },

        isbn: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 30
        },

        category: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "Quantity must be a whole number"
            }
        },

        availableQuantity: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "Available quantity must be a whole number"
            }
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        }
    },
    {
        timestamps: true
    }
);


/*
 * Validate available quantity against total quantity.
 *
 * This is intentionally an async middleware with no `next()`.
 * It works correctly with the current Mongoose middleware behavior.
 */
bookSchema.pre("validate", async function () {
    if (
        this.availableQuantity !== undefined &&
        this.quantity !== undefined &&
        this.availableQuantity > this.quantity
    ) {
        this.invalidate(
            "availableQuantity",
            "Available quantity cannot exceed total quantity"
        );
    }
});


/*
 * Borrowed copies
 *
 * Example:
 *
 * quantity = 10
 * availableQuantity = 7
 * borrowedQuantity = 3
 */
bookSchema.virtual("borrowedQuantity").get(function () {
    const total = Number(this.quantity || 0);

    const available = Number(
        this.availableQuantity || 0
    );

    return Math.max(
        total - available,
        0
    );
});


/*
 * Book status is determined from
 * available copies.
 */
bookSchema.virtual("status").get(function () {
    const available = Number(
        this.availableQuantity || 0
    );

    if (available === 0) {
        return "Out of Stock";
    }

    if (available <= 5) {
        return "Low Stock";
    }

    return "Available";
});


bookSchema.set("toJSON", {
    virtuals: true
});

bookSchema.set("toObject", {
    virtuals: true
});


const Book = mongoose.model(
    "Book",
    bookSchema
);

export default Book;