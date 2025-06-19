const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler }



// //try catch method bata garne tarika 

// //higgher order function in js read in detail to understand 
// const asyncHandler = (fn) => async(req, res, next) => {


//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 5000).json({
//             success: false,
//             message: error.message
//         })
//     }
// }
// export { asyncHandler }