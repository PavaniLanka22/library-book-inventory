const Loading = () => {
    return (
        <div
            className="loading-container"
            role="status"
            aria-live="polite"
            aria-label="Loading books"
        >
            <div className="spinner" />

            <p>Loading books...</p>
        </div>
    );
};

export default Loading;