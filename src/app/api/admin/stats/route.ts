import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { db } from "@/database/db";
import { 
  users, 
  listings, 
  messages, 
  conversations,
  favorites,
  savedSearches,
  blogArticles,
  subscriptions,
  listingLocations,
  alertNotifications
} from "@/database/schema";
import { count, sql, eq, gte, lte, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days

    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - parseInt(period));

    // User Statistics
    const [totalUsers] = await db.select({ count: count() }).from(users);
    const [newUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, periodStart));
    const [verifiedProfessionals] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.isVerifiedProfessional, true));
    const [adminUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "admin"));

    // Listings Statistics
    const [totalListings] = await db.select({ count: count() }).from(listings);
    const [activeListings] = await db
      .select({ count: count() })
      .from(listings)
      .where(eq(listings.status, "active"));
    const [newListings] = await db
      .select({ count: count() })
      .from(listings)
      .where(gte(listings.createdAt, periodStart));
    const [boostPlusListings] = await db
      .select({ count: count() })
      .from(listings)
      .where(eq(listings.isBoostPlus, true));

    // Listings by type
    const listingsByType = await db
      .select({
        type: listings.listingType,
        count: count()
      })
      .from(listings)
      .groupBy(listings.listingType);

    // Listings by status
    const listingsByStatus = await db
      .select({
        status: listings.status,
        count: count()
      })
      .from(listings)
      .groupBy(listings.status);

    // Views and engagement
    const [totalViews] = await db
      .select({ 
        totalViews: sql<number>`SUM(${listings.viewsCount})`,
        totalContacts: sql<number>`SUM(${listings.contactsCount})`
      })
      .from(listings);

    // Messages and conversations
    const [totalMessages] = await db.select({ count: count() }).from(messages);
    const [newMessages] = await db
      .select({ count: count() })
      .from(messages)
      .where(gte(messages.createdAt, periodStart));
    const [totalConversations] = await db.select({ count: count() }).from(conversations);

    // Favorites and saved searches
    const [totalFavorites] = await db.select({ count: count() }).from(favorites);
    const [totalSavedSearches] = await db.select({ count: count() }).from(savedSearches);
    const [alertsSent] = await db.select({ count: count() }).from(alertNotifications);

    // Blog statistics
    const [publishedArticles] = await db
      .select({ count: count() })
      .from(blogArticles)
      .where(eq(blogArticles.isPublished, true));
    const [draftArticles] = await db
      .select({ count: count() })
      .from(blogArticles)
      .where(eq(blogArticles.isPublished, false));

    // Subscriptions
    const [activeSubscriptions] = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, "active"));

    // Top regions (limited to top 5)
    const topRegions = await db
      .select({
        region: listingLocations.region,
        count: count()
      })
      .from(listingLocations)
      .innerJoin(listings, eq(listingLocations.listingId, listings.id))
      .groupBy(listingLocations.region)
      .orderBy(desc(count()))
      .limit(5);

    // User growth (last 6 months)
    const userGrowth = await db
      .select({
        month: sql<string>`TO_CHAR(${users.createdAt}, 'YYYY-MM')`,
        count: count()
      })
      .from(users)
      .where(gte(users.createdAt, new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)))
      .groupBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`);

    // Recent activity (last 10 listings)
    const recentListings = await db
      .select({
        id: listings.id,
        title: listings.title,
        type: listings.listingType,
        status: listings.status,
        views: listings.viewsCount,
        createdAt: listings.createdAt,
        userName: users.name,
        userEmail: users.email
      })
      .from(listings)
      .innerJoin(users, eq(listings.userId, users.id))
      .orderBy(desc(listings.createdAt))
      .limit(10);

    // Calculate percentage changes
    const previousPeriodStart = new Date();
    previousPeriodStart.setDate(previousPeriodStart.getDate() - parseInt(period) * 2);
    previousPeriodStart.setDate(previousPeriodStart.getDate() + parseInt(period));

    const [previousNewUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        gte(users.createdAt, previousPeriodStart),
        lte(users.createdAt, periodStart)
      ));

    const [previousNewListings] = await db
      .select({ count: count() })
      .from(listings)
      .where(and(
        gte(listings.createdAt, previousPeriodStart),
        lte(listings.createdAt, periodStart)
      ));

    const userGrowthPercentage = previousNewUsers.count > 0 
      ? ((newUsers.count - previousNewUsers.count) / previousNewUsers.count) * 100 
      : 100;

    const listingGrowthPercentage = previousNewListings.count > 0 
      ? ((newListings.count - previousNewListings.count) / previousNewListings.count) * 100 
      : 100;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalUsers: totalUsers.count,
          newUsers: newUsers.count,
          userGrowthPercentage: Math.round(userGrowthPercentage * 100) / 100,
          verifiedProfessionals: verifiedProfessionals.count,
          adminUsers: adminUsers.count,
          totalListings: totalListings.count,
          activeListings: activeListings.count,
          newListings: newListings.count,
          listingGrowthPercentage: Math.round(listingGrowthPercentage * 100) / 100,
          boostPlusListings: boostPlusListings.count,
          totalViews: totalViews.totalViews || 0,
          totalContacts: totalViews.totalContacts || 0,
          totalMessages: totalMessages.count,
          newMessages: newMessages.count,
          totalConversations: totalConversations.count,
          totalFavorites: totalFavorites.count,
          totalSavedSearches: totalSavedSearches.count,
          alertsSent: alertsSent.count,
          publishedArticles: publishedArticles.count,
          draftArticles: draftArticles.count,
          activeSubscriptions: activeSubscriptions.count
        },
        charts: {
          listingsByType,
          listingsByStatus,
          topRegions,
          userGrowth
        },
        recentActivity: recentListings,
        period: parseInt(period)
      }
    });
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}