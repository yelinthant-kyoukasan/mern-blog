export const errHandler = (statusCode, message) => {
    const error = { statusCode, message }
    return error;
}