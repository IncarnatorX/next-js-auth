import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

await connectDB();

// CREATING A POST REQUEST AT api/users/signup
export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username) {
      return NextResponse.json(
        { message: "Username missing in your request" },
        { status: 400 }
      );
    }

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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "New user successfully created successfully.",
        success: true,
        newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
