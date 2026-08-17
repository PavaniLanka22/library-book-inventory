const BookCard = ({
    book,
    onEdit,
    onDelete
}) => {
    const availableQuantity =
        book.availableQuantity ??
        book.quantity ??
        0;

    return (
        <article className="book-card">
            <div className="book-card-header">
                <div
                    className="book-cover"
                    aria-hidden="true"
                >
                    {book.title
                        ?.charAt(0)
                        ?.toUpperCase()}
                </div>

                <div>
                    <h3>
                        {book.title}
                    </h3>

                    <p>
                        {book.author}
                    </p>
                </div>
            </div>

            <div className="book-card-grid">
                <div>
                    <span>
                        ISBN
                    </span>

                    <strong>
                        {book.isbn}
                    </strong>
                </div>

                <div>
                    <span>
                        Category
                    </span>

                    <strong>
                        {
                            book.category
                        }
                    </strong>
                </div>

                <div>
                    <span>
                        Quantity
                    </span>

                    <strong>
                        {
                            book.quantity
                        }
                    </strong>
                </div>

                <div>
                    <span>
                        Available
                    </span>

                    <strong>
                        {
                            availableQuantity
                        }
                    </strong>
                </div>
            </div>

            <div className="book-card-actions">
                <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                        onEdit(book)
                    }
                    aria-label={`Edit ${book.title}`}
                >
                    Edit
                </button>

                <button
                    type="button"
                    className="danger-button"
                    onClick={() =>
                        onDelete(book)
                    }
                    aria-label={`Delete ${book.title}`}
                >
                    Delete
                </button>
            </div>
        </article>
    );
};

export default BookCard;