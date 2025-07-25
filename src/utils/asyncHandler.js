const asyncHandler = (requestHandler) =>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((err)=>next(err))
    }

}

export {asyncHandler}



//both of the codes are correct they are jsut different syntaxes 
//Yaha par asyncHandler jo use kra h vo function k andar function h usko desructure krke likha h it is basically (func)=>{()=>{}}
// const asyncHandler = (fn)=>async(req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }catch(error){
//         res.status(err.code || 500).json({
//             success: false,
//             message:err.message
//         })
//     }

// }