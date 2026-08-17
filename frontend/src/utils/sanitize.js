export const sanitizeText = (
    value
) => {
    if (
        typeof value !==
        "string"
    ) {
        return value;
    }

    /*
     * Remove HTML angle brackets before
     * the value enters React state.
     *
     * React also escapes rendered text,
     * while the backend performs a second
     * sanitize-html pass before persistence.
     */
    return value
        .replace(/[<>]/g, "")
        .trim();
};

export const cleanBookData = (
    book
) => {
    return {
        title: sanitizeText(
            book.title
        ),

        author: sanitizeText(
            book.author
        ),

        isbn: sanitizeText(
            book.isbn
        ),

        category: sanitizeText(
            book.category
        ),

        quantity: Number(
            book.quantity
        ),

        availableQuantity:
            Number(
                book.availableQuantity
            )
    };
};