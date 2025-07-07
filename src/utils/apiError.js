class ApiError extends Error {
    constructor(
        statusCode,
        message="Somwthing went wrong",
        errors = [],
        stack=""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.mesage = message 
        this.success = false;
        this.errors = errors


    if(stack){
        this.stack = stack
    }else{
        Error.captureStackTrace(this,this.constructor)
    }
    }

}

export {ApiError}