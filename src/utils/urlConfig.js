// Config cho URL API và assets
const API_CONFIG = {
  // Base URL cho API server - có thể override bằng environment variable
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3999",
//  BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://kltnbe-production.up.railway.app" || "http://localhost:3999",

  // Endpoints
  API_VERSION: import.meta.env.VITE_API_VERSION || "/v1/api",

  // Asset paths
  IMAGES_PATH: import.meta.env.VITE_IMAGES_PATH || "/uploads/students",

  // Default images
  DEFAULT_AVATAR:
    import.meta.env.VITE_DEFAULT_AVATAR ||
    "https://res.cloudinary.com/demo/image/upload/v1234567890/default-avatar.png",
};

// Helper functions để xử lý URL
export const formatImageUrl = (imagePath) => {
  if (!imagePath) return API_CONFIG.DEFAULT_AVATAR;

  // Nếu URL đã có domain (http/https) thì return nguyên
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Nếu chỉ có path thì thêm base URL
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${API_CONFIG.BASE_URL}${cleanPath}`;
};

export const formatAvatarUrl = (avatarPath) => {
  return formatImageUrl(avatarPath);
};

// Function để get base API URL
export const getApiBaseUrl = () => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`;
};

// Function để get upload URL
export const getUploadUrl = (type = "student") => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/images/upload/${type}`;
};

// Export config để sử dụng trực tiếp nếu cần
export default API_CONFIG;
