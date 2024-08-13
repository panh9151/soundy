import { NextResponse } from "next/server"

export const objectResponse = (object : Object, status : number = 200) : NextResponse => {
  return new NextResponse(JSON.stringify(object),  { status: status })
}

export const arrayResponse = (arr : Array<any>, status : number = 200) : NextResponse => {
  return new NextResponse(JSON.stringify(arr),  { status: status })
}

export const stringResponse = (str : string, status : number = 200) : NextResponse => {
  return new NextResponse(str,  { status: status })
}