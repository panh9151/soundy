import { getCurrentUser } from "@/utils/Get";
import { NextResponse } from "next/server";

export const objectResponse = (
  object: Object,
  status: number = 200
): NextResponse => {
  return new NextResponse(JSON.stringify(object), { status: status });
};

export const arrayResponse = (
  arr: Array<any>,
  status: number = 200
): NextResponse => {
  return new NextResponse(JSON.stringify(arr), { status: status });
};

export const stringResponse = (
  str: string,
  status: number = 200
): NextResponse => {
  return new NextResponse(str, { status: status });
};

export const getQueryParams = (req: Request) => {
  // Tạo đối tượng URL từ chuỗi URL
  const url = new URL(req.url);

  // Trích xuất các tham số truy vấn
  const params = Object.fromEntries(url.searchParams.entries());

  return params;
};
