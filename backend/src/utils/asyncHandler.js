const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
        //Promise.resolve(): Converts anything into a Promise
    }
}


export default asyncHandler 
