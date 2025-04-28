import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

await connectDB();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value as string;

    const decodedUser = jwt.verify(token, process.env.TOKEN_SECRET!);

    const { id } = decodedUser as jwt.JwtPayload;

    const user = await User.find({ id, token });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid request. Unable to verify the user identity.",
        },
        { status: 404 }
      );
    }

    if (user) {
      await User.findByIdAndUpdate(id, { token: "" });

      const response = NextResponse.json(
        { message: "User logged out successfully." },
        { status: 200 }
      );

      response.cookies.delete("token");

      return response;
    }
  } catch (error) {
    console.log("ERROR:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
