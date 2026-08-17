import {
    useEffect,
    useState
} from "react";

import {
    cleanBookData,
    sanitizeText
} from "../utils/sanitize";

const initialForm = {
    title: "",
    author: "",
    isbn: "",
    category: "",
    quantity: "",
    availableQuantity: ""
};

const BookModal = ({
    book,
    onClose,
    onSave,
    loading
}) => {
    const [form, setForm] =
        useState(initialForm);

    const [errors, setErrors] =
        useState({});

    useEffect(() => {
        if (book) {
            setForm({
                title: sanitizeText(
                    book.title || ""
                ),

                author: sanitizeText(
                    book.author || ""
                ),

                isbn: sanitizeText(
                    book.isbn || ""
                ),

                category:
                    sanitizeText(
                        book.category ||
                            ""
                    ),

                quantity:
                    book.quantity ??
                    "",

                /*
                 * Older records did not have
                 * availableQuantity.
                 *
                 * Treat their entire quantity
                 * as available initially.
                 */
                availableQuantity:
                    book.availableQuantity ??
                    book.quantity ??
                    ""
            });
        } else {
            setForm(initialForm);
        }

        setErrors({});
    }, [book]);

    const handleChange = (
        event
    ) => {
        const {
            name,
            value
        } = event.target;

        const sanitizedValue =
            [
                "title",
                "author",
                "isbn",
                "category"
            ].includes(name)
                ? sanitizeText(
                      value
                  )
                : value;

        setForm(
            (previous) => ({
                ...previous,
                [name]:
                    sanitizedValue
            })
        );

        setErrors(
            (previous) => ({
                ...previous,
                [name]: ""
            })
        );
    };

    const validate = () => {
        const newErrors = {};

        if (!form.title.trim()) {
            newErrors.title =
                "Title is required";
        }

        if (!form.author.trim()) {
            newErrors.author =
                "Author is required";
        }

        if (!form.isbn.trim()) {
            newErrors.isbn =
                "ISBN is required";
        }

        if (!form.category.trim()) {
            newErrors.category =
                "Category is required";
        }

        if (
            form.quantity ===
                "" ||
            !Number.isInteger(
                Number(
                    form.quantity
                )
            ) ||
            Number(form.quantity) <
                0
        ) {
            newErrors.quantity =
                "Enter a valid non-negative whole number";
        }

        if (
            form.availableQuantity ===
                "" ||
            !Number.isInteger(
                Number(
                    form.availableQuantity
                )
            ) ||
            Number(
                form.availableQuantity
            ) < 0
        ) {
            newErrors.availableQuantity =
                "Enter a valid non-negative whole number";
        }

        if (
            form.quantity !==
                "" &&
            form.availableQuantity !==
                "" &&
            Number(
                form.availableQuantity
            ) >
                Number(
                    form.quantity
                )
        ) {
            newErrors.availableQuantity =
                "Available quantity cannot exceed total quantity";
        }

        setErrors(
            newErrors
        );

        return (
            Object.keys(
                newErrors
            ).length === 0
        );
    };

    const handleSubmit =
        async (event) => {
            event.preventDefault();

            if (!validate()) {
                return;
            }

            const cleanData =
                cleanBookData(
                    form
                );

            await onSave(
                cleanData
            );
        };

    return (
        <div
            className="modal-overlay"
            role="presentation"
            onMouseDown={(
                event
            ) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="book-modal-title"
            >
                <div className="modal-header">
                    <div>
                        <span className="modal-eyebrow">
                            Library
                        </span>

                        <h2 id="book-modal-title">
                            {book
                                ? "Edit Book"
                                : "Add New Book"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={
                            onClose
                        }
                        aria-label="Close dialog"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    noValidate
                >
                    <div className="form-grid">
                        <div className="form-group full">
                            <label htmlFor="title">
                                Title
                            </label>

                            <input
                                id="title"
                                name="title"
                                value={
                                    form.title
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    errors.title
                                        ? "input-error"
                                        : ""
                                }
                                aria-invalid={Boolean(
                                    errors.title
                                )}
                                aria-describedby={
                                    errors.title
                                        ? "title-error"
                                        : undefined
                                }
                            />

                            {errors.title && (
                                <span
                                    id="title-error"
                                    className="field-error"
                                >
                                    {
                                        errors.title
                                    }
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="author">
                                Author
                            </label>

                            <input
                                id="author"
                                name="author"
                                value={
                                    form.author
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    errors.author
                                        ? "input-error"
                                        : ""
                                }
                                aria-invalid={Boolean(
                                    errors.author
                                )}
                            />

                            {errors.author && (
                                <span className="field-error">
                                    {
                                        errors.author
                                    }
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="isbn">
                                ISBN
                            </label>

                            <input
                                id="isbn"
                                name="isbn"
                                value={
                                    form.isbn
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    errors.isbn
                                        ? "input-error"
                                        : ""
                                }
                                aria-invalid={Boolean(
                                    errors.isbn
                                )}
                            />

                            {errors.isbn && (
                                <span className="field-error">
                                    {
                                        errors.isbn
                                    }
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">
                                Category
                            </label>

                            <input
                                id="category"
                                name="category"
                                value={
                                    form.category
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    errors.category
                                        ? "input-error"
                                        : ""
                                }
                                aria-invalid={Boolean(
                                    errors.category
                                )}
                            />

                            {errors.category && (
                                <span className="field-error">
                                    {
                                        errors.category
                                    }
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">
                                Total Quantity
                            </label>

                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="0"
                                step="1"
                                value={
                                    form.quantity
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    errors.quantity
                                        ? "input-error"
                                        : ""
                                }
                                aria-invalid={Boolean(
                                    errors.quantity
                                )}
                            />

                            {errors.quantity && (
                                <span className="field-error">
                                    {
                                        errors.quantity
                                    }
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="availableQuantity">
                                Available Quantity
                            </label>

                            <input
                                id="availableQuantity"
                                name="availableQuantity"
                                type="number"
                                min="0"
                                step="1"
                                value={
                                    form.availableQuantity
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    errors.availableQuantity
                                        ? "input-error"
                                        : ""
                                }
                                aria-invalid={Boolean(
                                    errors.availableQuantity
                                )}
                            />

                            {errors.availableQuantity && (
                                <span className="field-error">
                                    {
                                        errors.availableQuantity
                                    }
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={
                                onClose
                            }
                            disabled={
                                loading
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                loading
                            }
                        >
                            {loading
                                ? "Saving..."
                                : book
                                ? "Update Book"
                                : "Add Book"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookModal;