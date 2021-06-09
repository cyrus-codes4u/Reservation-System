function methodNotAllowed(req,res,next){
    next(
        {
            message: "Request method not allowed on this route"
        }
    )
}

export default methodNotAllowed