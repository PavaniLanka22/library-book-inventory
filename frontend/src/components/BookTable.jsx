const BookTable = ({
    books,
    onEdit,
    onDelete
}) => {
    return (
        <div className="table-container">
            <table className="book-table">
                <caption className="sr-only">
                    Library books
                </caption>

                <thead>
                    <tr>
                        <th scope="col">
                            Book
                        </th>

                        <th scope="col">
                            Author
                        </th>

                        <th scope="col">
                            ISBN
                        </th>

                        <th scope="col">
                            Category
                        </th>

                        <th scope="col">
                            Quantity
                        </th>

                        <th scope="col">
                            Available
                        </th>

                        <th scope="col">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {books.map(
                        (book) => {
                            const availableQuantity =
                                book.availableQuantity ??
                                book.quantity ??
                                0;

                            return (
                                <tr
                                    key={
                                        book._id
                                    }
                                >
                                    <td>
                                        <div className="book-title">
                                            <span
                                                className="book-cover"
                                                aria-hidden="true"
                                            >
                                                {book.title
                                                    ?.charAt(
                                                        0
                                                    )
                                                    ?.toUpperCase()}
                                            </span>

                                            <strong>
                                                {
                                                    book.title
                                                }
                                            </strong>
                                        </div>
                                    </td>

                                    <td>
                                        {
                                            book.author
                                        }
                                    </td>

                                    <td className="isbn">
                                        {
                                            book.isbn
                                        }
                                    </td>

                                    <td>
                                        <span className="category-badge">
                                            {
                                                book.category
                                            }
                                        </span>
                                    </td>

                                    <td>
                                        {
                                            book.quantity
                                        }
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                Number(
                                                    availableQuantity
                                                ) >
                                                0
                                                    ? "availability available"
                                                    : "availability unavailable"
                                            }
                                        >
                                            {
                                                availableQuantity
                                            }
                                        </span>
                                    </td>

                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                type="button"
                                                className="icon-button"
                                                onClick={() =>
                                                    onEdit(
                                                        book
                                                    )
                                                }
                                                aria-label={`Edit ${book.title}`}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="icon-button danger"
                                                onClick={() =>
                                                    onDelete(
                                                        book
                                                    )
                                                }
                                                aria-label={`Delete ${book.title}`}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BookTable;