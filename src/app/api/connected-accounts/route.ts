/**
 * GET /api/connected-accounts
 *
 * Returns the list of connected social accounts for the active project.
 */

import { NextRequest, NextResponse } from "next/server";
import { ProjectId } from "@/types";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const projectId = (searchParams.get("projectId") || "okn-token") as ProjectId;

  // In production, queries Supabase social_accounts table
  return NextResponse.json({
    projectId,
    accounts: [],
    timestamp: new Date().toISOString(),
  });
}
