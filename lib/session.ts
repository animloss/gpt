import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function getSession() {
  const token = cookies().get("muzik_token")?.value;
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get("muzik_token")?.value;
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}
