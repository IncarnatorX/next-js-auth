import connectDB from "@/dbConfig/dbConfig";
import getDataFromToken from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

await connectDB();

export async function GET(request: NextRequest) {
  try {
    const userID = getDataFromToken(request);

    if (!userID) {
      return NextResponse.json(
        { message: "Verification failed. Cannot fetch the user details" },
        { status: 500 }
      );
    }

    const user = await User.findById(userID).select("-password -token");

    if (!user) {
      return NextResponse.json(
        { message: "Unable to fetch the user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User data fetched successfully.", user },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("SOMETHING WENT WRONG");
      console.error(error);
    }
  }
}
