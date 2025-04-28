import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

await connectDB();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email missing in your request" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { message: "Password missing in your request" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "No user exits with the email provided" },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect Password." },
        { status: 404 }
      );
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1hr",
    });

    if (!token) {
      return NextResponse.json({ message: "Login failure." }, { status: 500 });
    }

    await User.updateOne({ email }, { token });

    const response = NextResponse.json(
      {
        success: true,
        message: "User logged in successfully.",
      },
      { status: 200 }
    );

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error) {
    console.log("ERROR:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
