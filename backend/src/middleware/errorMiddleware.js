const errorMiddleware = (err, req, res, _next) => {
    console.error("API Error:", err);

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
        data: null
    });
};

export default errorMiddleware;