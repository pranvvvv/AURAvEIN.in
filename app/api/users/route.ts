import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET users
export async function GET() {
  try {
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json([]);
    }
    const db = client.db("auravein");
    const users = await db.collection("users").find({}).toArray();
    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json([]);
  }
}

// POST user
export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }
    const db = client.db("auravein");
    const data = await req.json();
    const result = await db.collection("users").insertOne(data);
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (e: any) {
    return NextResponse.json({ error: "Database operation failed.", details: e.message }, { status: 500 });
  }
}

// PUT user
export async function PUT(req: NextRequest) {
  try {
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }
    const db = client.db("auravein");
    const data = await req.json();
    const { _id, ...update } = data;
    await db.collection("users").updateOne({ _id: new ObjectId(_id) }, { $set: update });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Database operation failed.", details: e.message }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }
    const db = client.db("auravein");
    const { _id } = await req.json();
    await db.collection("users").deleteOne({ _id: new ObjectId(_id) });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Database operation failed.", details: e.message }, { status: 500 });
  }
}