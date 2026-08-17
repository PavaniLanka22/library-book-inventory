import { sanitizeText } from "../utils/sanitize";

const SearchBar = ({
    search,
    setSearch,
    onAdd
}) => {
    const handleSearchChange = (
        event
    ) => {
        const sanitized =
            sanitizeText(
                event.target.value
            );

        setSearch(sanitized);
    };

    return (
        <section
            className="toolbar"
            aria-label="Book collection controls"
        >
            <div className="search-wrapper">
                <label
                    htmlFor="book-search"
                    className="sr-only"
                >
                    Search books
                </label>

                <span
                    className="search-icon"
                    aria-hidden="true"
                >
                    ⌕
                </span>

                <input
                    id="book-search"
                    type="search"
                    value={search}
                    onChange={
                        handleSearchChange
                    }
                    placeholder="Search by title, author, ISBN..."
                    aria-label="Search books by title, author or ISBN"
                />
            </div>

            <button
                type="button"
                className="primary-button"
                onClick={onAdd}
                aria-label="Add a new book"
            >
                <span aria-hidden="true">
                    +
                </span>
                Add Book
            </button>
        </section>
    );
};

export default SearchBar;