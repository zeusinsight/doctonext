import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { db } from "@/database/db";
import { listings, users, listingLocations } from "@/database/schema";
import { eq, ilike, sql, desc, asc, and, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const status = searchParams.get("status");
    const listingType = searchParams.get("listingType");
    const userId = searchParams.get("userId");

    const offset = (page - 1) * limit;

    let baseQuery = db
      .select({
        id: listings.id,
        title: listings.title,
        description: listings.description,
        listingType: listings.listingType,
        specialty: listings.specialty,
        status: listings.status,
        viewsCount: listings.viewsCount,
        contactsCount: listings.contactsCount,
        createdAt: listings.createdAt,
        updatedAt: listings.updatedAt,
        publishedAt: listings.publishedAt,
        expiresAt: listings.expiresAt,
        isBoostPlus: listings.isBoostPlus,
        userId: listings.userId,
        userName: users.name,
        userEmail: users.email,
        city: listingLocations.city,
        region: listingLocations.region,
      })
      .from(listings)
      .leftJoin(users, eq(listings.userId, users.id))
      .leftJoin(listingLocations, eq(listings.id, listingLocations.listingId))
      .$dynamic();

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(listings.title, `%${search}%`),
          ilike(listings.description, `%${search}%`),
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    if (status && status !== "all") {
      conditions.push(eq(listings.status, status));
    }

    if (listingType && listingType !== "all") {
      conditions.push(eq(listings.listingType, listingType));
    }

    if (userId) {
      conditions.push(eq(listings.userId, userId));
    }

    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions));
    }

    const orderColumn = sortBy === "title" ? listings.title
                     : sortBy === "status" ? listings.status
                     : sortBy === "listingType" ? listings.listingType
                     : sortBy === "userName" ? users.name
                     : sortBy === "viewsCount" ? listings.viewsCount
                     : listings.createdAt;

    const orderDirection = sortOrder === "asc" ? asc : desc;
    baseQuery = baseQuery.orderBy(orderDirection(orderColumn));

    const listingsData = await baseQuery.limit(limit).offset(offset);

    // Get total count for pagination
    let countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .leftJoin(users, eq(listings.userId, users.id))
      .$dynamic();

    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }

    const [totalResult] = await countQuery;
    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    // Get user info if filtering by userId
    let userInfo = null;
    if (userId) {
      const [user] = await db
        .select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      userInfo = user;
    }

    return NextResponse.json({
      success: true,
      data: {
        listings: listingsData,
        userInfo,
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
    console.error("Error fetching admin listings:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des annonces" },
      { status: 500 }
    );
  }
}