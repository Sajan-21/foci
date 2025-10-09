exports.sendResponse = (res, statusCode, success, message, data) => {
    res.status(statusCode).json({
        success,
        message: message ? message : null,
        data: data ? data : null
    });
}