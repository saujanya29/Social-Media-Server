const success = (statusCode,result) =>{
    return {
        status : "ok",
        statusCode,
        result
    }
}

const error = (statusCode,message) =>{
    return {
        status : "error",
        statusCode,
        message
    }
}

module.exports = {
    error,
    success
}