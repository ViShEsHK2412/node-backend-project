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
        console.log("File Uploaded on Cloudinary",response.url)
        return response
    } catch (error) {
        fs.unlinkSync(LocalFilePath) //remove the locally saved temporary file as the oepration got failed

        
    }

}

export {cloudinaryFileUpload}
