import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/apiError.js'
import{User} from '../models/user.model.js'
import { cloudinaryFileUpload } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/apiResponse.js'
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async function(userId){
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken , refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access tokens")
        
    }

}


const registerUser  =  asyncHandler( async(req,res)=>{
    const {username,email,fullname,password} =  req.body
    console.log("email:",email);

    if(
        [fullname,email,password,username].some((field)=>
            field?.trim() === "")
        
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser  = await User.findOne({
        $or : [{ username } , { email }]

    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0].path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){
         coverImageLocalPath = req.files?.coverImage[0]?.path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"AVATAR FILE IS REQUIRED")
    }

    const avatar = await cloudinaryFileUpload(avatarLocalPath)
    const coverImage = await cloudinaryFileUpload(coverImageLocalPath)

    if(!avatar){
    throw new ApiError(400,"Avatar upload to Cloudinary failed");
}

    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )

     if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
     }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "user registered successfully")
    )
    

})

const loginUser = asyncHandler(async (req,res)=>{
    const{email,username,password} = req.body
    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }
//user ka email and username dono dhund skte h ek saath using mongo db operators($) this allow us to find both together 
   const user = await User.findOne({
        $or : [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User Does Not Exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid User Credentials")
    }

    const{accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
//cookies ko by default koi bhi modify kar skta h frontend par so httponly and secure ko true krne k baad sirf server se modify kr skte h
    const options ={
        httpOnly : true,
        secure: true,
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "User logged In Successfully"
        )
    )

    

})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken : undefined
            }
        },
        {
            new: true
        }
    )
    const options ={
        httpOnly : true,
        secure: true,
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {},"User logged Out"))
   

})

const refresAccessToken  = asyncHandler(async(req,res)=>{
   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

    if(incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            rocess.env.REFRESH_TOKEN_SECRET
        )
        const user  = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken : accessToken,
                    refreshToken : newRefreshToken
                },
                "Access Token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh Token")
        
    }

})

export{
    registerUser,
    loginUser,
    logoutUser,
    refresAccessToken
}
//register User
// get user details from frontend
    //validation - not empty 
    //check if user already exists - check through username or email
    // check for images , check for avatar 
    //upload them to cloudinary , avatar
    //create user object - create entry in db  
    //remove password and refresh token field form response
    //check for user creation 
    //return res  

//login User
// get user details from frontend
//check if user has registered
//if user has registerd and is logged in provide a accesstoken to the user through refreshtoken

//req body-> data
//username or email
//find user
//password cehck
//access and refresh token send both to user
//cookies 


//logout User
//cookies clear krni padegi
//reset refresh token
//middleware creation for authentication



//refreshingAccessToken
//pehle incoming refresh token ko access kra
//then verify kra jwt k through
//

    