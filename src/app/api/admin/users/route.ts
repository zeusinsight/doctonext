import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { db } from "@/database/db";
import { users, listings } from "@/database/schema";
import { count, eq, sql, ilike, desc, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const verificationFilter = searchParams.get("verified");

    const offset = (page - 1) * limit;

    let baseQuery = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        isVerifiedProfessional: users.isVerifiedProfessional,
        role: users.role,
        listingsCount: count(listings.id),
      })
      .from(users)
      .leftJoin(listings, eq(users.id, listings.userId))
      .groupBy(users.id, users.name, users.email, users.createdAt, users.isVerifiedProfessional, users.role)
      .$dynamic();

    if (search) {
      baseQuery = baseQuery.where(
        sql`${ilike(users.name, `%${search}%`)} OR ${ilike(users.email, `%${search}%`)}`
      );
    }

    if (verificationFilter !== null) {
      const isVerified = verificationFilter === "true";
      baseQuery = baseQuery.where(eq(users.isVerifiedProfessional, isVerified));
    }

    const orderColumn = sortBy === "name" ? users.name 
                     : sortBy === "email" ? users.email
                     : sortBy === "createdAt" ? users.createdAt
                     : users.createdAt;

    const orderDirection = sortOrder === "asc" ? asc : desc;
    baseQuery = baseQuery.orderBy(orderDirection(orderColumn));

    const usersData = await baseQuery.limit(limit).offset(offset);

    const [totalResult] = await db
      .select({ count: count() })
      .from(users)
      .where(
        search
          ? sql`${ilike(users.name, `%${search}%`)} OR ${ilike(users.email, `%${search}%`)}`
          : undefined
      );

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        users: usersData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}