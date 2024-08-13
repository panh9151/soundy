import cloudinary from "cloudinary";

// Cấu hình Cloudinary với các thông tin từ tài khoản Cloudinary của bạn
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default cloudinary;
