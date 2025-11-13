import clientPromise from "../../../../../lib/mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from 'next/server'; // <-- Import NextResponse


export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      // Use NextResponse to send a proper JSON response with a status code
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Add password validation
    if (password.length < 6) {
        return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 }); // 409 Conflict
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "User created successfully", userId: result.insertedId }, { status: 201 });

  } catch (error) {
    console.error("❌ SIGNUP_ERROR:", error);
    // Ensure that even in the case of a server error, we send back a JSON response
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
