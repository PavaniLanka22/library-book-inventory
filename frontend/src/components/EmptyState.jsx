const EmptyState = ({ search }) => {
    return (
        <div className="empty-state">
            <div
                className="empty-icon"
                aria-hidden="true"
            >
                📚
            </div>

            <h3>
                {search
                    ? "No books found"
                    : "No books available"}
            </h3>

            <p>
                {search
                    ? "Try changing your search terms."
                    : "Add your first book to start managing the library."}
            </p>
        </div>
    );
};

export default EmptyState;