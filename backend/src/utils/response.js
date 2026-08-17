const successResponse = (
    res,
    statusCode,
    message,
    data = null,
    extra = {}
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        ...extra
    });
};

const errorResponse = (
    res,
    statusCode,
    message,
    data = null
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data
    });
};

export {
    successResponse,
    errorResponse
};