import { NextResponse } from "next/server";
import { getServerErrorMsg, throwCustomError } from "./utils/Error";
import { jwtVerify, JWTVerifyResult } from "jose";
import Env from "./utils/Env";
import { objectResponse } from "./utils/Response";

const secretToken = Env.ACCESS_TOKEN_SECRET;

export async function middleware(request: Request) {
  // Giả sử bạn cần gọi API để xác thực token
  const token = request.headers.get("token");
  const response = NextResponse.next();

  // Check if there is no token
  if (!token) {
    response.headers.set("user", "Unauthorized");
    return;
  }

  try {
    // Decoded and get ID user
    let decoded: JWTVerifyResult | null = null;
    try {
      decoded = await jwtVerify(token, secretToken);
    } catch (error) {
      throwCustomError("Token expired");
    }
    // return objectResponse("test");
    if (!decoded?.payload) {
      throwCustomError("Failed to verify token", 500);
    }
    const userId: string = (decoded?.payload.id as string) || "";

    // const userId = await getUserbyId(userId);

    response.headers.set("userId", userId);
    return response;
  } catch (error) {
    return getServerErrorMsg(error);
  }
}

// Cấu hình matcher để áp dụng middleware chỉ cho các route cụ thể
export const config = {
  matcher: ["/api/profile", "/api/change-password", "/api/update-infor"],
};
