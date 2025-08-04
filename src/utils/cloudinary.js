import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const cloudinaryFileUpload = async (LocalFilePath) => {
    try {
        if(!LocalFilePath ) return null
        //file upload to cloudinary
        const response = await cloudinary.uploader
        .upload(LocalFilePath, {
            resource_type : "auto"
        })
        // console.log("File Uploaded on Cloudinary",response.url)
        fs.unlinkSync(LocalFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(LocalFilePath)
         //remove the locally saved temporary file as the oepration got failed  
         console.error("Cloudinary upload error:", error);
        return null; 
         
    }
        

}

const cloudinaryFileDelete = async(publicID) =>{
    try {
        if(!publicID) return null 
        const response  = await cloudinary.uploader
        .destroy(LocalFilePath,{
            resource_type : "auto"
        })
    } catch (error) {
        console.error("Cloudinary File Deletion error",error);
        return null;
        
    }
}


export {
    cloudinaryFileUpload,
    cloudinaryFileDelete

}
