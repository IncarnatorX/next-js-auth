import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/** 
 @returns {string}
 getDataFromToken method decodes the token and returns the user ID.
*/
function getDataFromToken(request: NextRequest): string {
  const token = request.cookies.get("token")?.value || "";
  if (!token) {
    throw new Error("Invalid token or token doesn't exist.");
  }

  const decodedUser: jwt.JwtPayload = jwt.verify(
    token,
    process.env.TOKEN_SECRET!
  ) as jwt.JwtPayload;

  return decodedUser.id;
}

export default getDataFromToken;
