import axiosLib from "axios";

// Tạo một axios của axios
const axios = axiosLib.create({
  baseURL: "http://localhost:3000/api", // URL gốc của API
});

// Thêm một request interceptor để gắn accessToken vào header của mỗi yêu cầu
axios.interceptors.request.use(
  (config) => {
    // const accessToken = localStorage.getItem("accessToken");
    const accessToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6InUyIiwiZXhwIjoxNzYwNTQzMDEzfQ.-rk8KHiVACAVJXe6OOG_winL7vr1nQTmk2VdLbUMlwo";
    if (accessToken) {
      config.headers["token"] = accessToken; // Gắn accessToken vào header với tên 'token'
    }
    return config;
  },
  (error) => {
    // Xử lý lỗi nếu có trong quá trình cấu hình yêu cầu
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  // @ts-ignore
  (response) => {
    // Xử lý dữ liệu phản hồi nếu thành công
    return {
      result: response.data,
      status: response.status,
    };
  },
  (error) => {
    if (error.response) {
      // Server trả về phản hồi với status không nằm trong khoảng 2xx
      console.error(`Error Status: ${error.response.status}`);
      console.error("Error Data:", error.response.data); // Dữ liệu trả về từ server
      console.error("Error Headers:", error.response.headers);
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không nhận được phản hồi từ server
      console.error("No Response Received:", error.request);
    } else {
      // Một lỗi khác xảy ra trong quá trình thiết lập yêu cầu
      console.error("Error Message:", error.message);
    }
    return Promise.reject(error); // Tiếp tục trả về lỗi để xử lý ở nơi gọi API
  }
);

export default axios;
