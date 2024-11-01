import { getServerErrorMsg } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";
import { OAuth2Client } from "google-auth-library";

export const POST = async (req: Request) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_TOKEN);
    const body = await req.json();
    const { googleToken } = body;

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_TOKEN,
    });
    const payload = ticket.getPayload();

    return objectResponse(payload as any);
  } catch (err) {
    return getServerErrorMsg(err);
  }
};
