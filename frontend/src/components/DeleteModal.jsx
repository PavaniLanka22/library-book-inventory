const DeleteModal = ({
    book,
    onClose,
    onConfirm,
    loading
}) => {
    if (!book) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div
                className="modal delete-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-title"
            >
                <div
                    className="delete-icon"
                    aria-hidden="true"
                >
                    !
                </div>

                <h2 id="delete-title">
                    Delete this book?
                </h2>

                <p>
                    You're about to remove{" "}
                    <strong>{book.title}</strong>{" "}
                    from the library inventory.
                </p>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="danger-button"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete Book"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;