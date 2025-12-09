import { site } from '@/config/site'

interface ListingSchemaProps {
  listing: {
    id: string
    title: string
    description: string | null
    listingType: string
    specialty: string | null
    status: string
    publishedAt: Date | null
    expiresAt: Date | null
    location?: {
      city: string
      region: string
      postalCode: string
      latitude: string | null
      longitude: string | null
    } | null
    details?: Record<string, unknown> | null
    media?: Array<{ fileUrl: string }> | null
    user?: {
      name: string
      profession?: string | null
    } | null
  }
}

const listingTypeLabels: Record<string, string> = {
  transfer: 'Cession',
  replacement: 'Remplacement',
  collaboration: 'Collaboration',
}

function formatPrice(listing: ListingSchemaProps['listing']): string | null {
  if (listing.listingType === 'transfer' && listing.details) {
    const details = listing.details as { salePrice?: number | null }
    if (details.salePrice) {
      return `${details.salePrice.toLocaleString('fr-FR')} EUR`
    }
  }
  if (listing.listingType === 'replacement' && listing.details) {
    const details = listing.details as { dailyRate?: number | null }
    if (details.dailyRate) {
      return `${details.dailyRate.toLocaleString('fr-FR')} EUR/jour`
    }
  }
  return null
}

function getPriceValue(listing: ListingSchemaProps['listing']): number | null {
  if (listing.listingType === 'transfer' && listing.details) {
    const details = listing.details as { salePrice?: number | null }
    return details.salePrice || null
  }
  if (listing.listingType === 'replacement' && listing.details) {
    const details = listing.details as { dailyRate?: number | null }
    return details.dailyRate || null
  }
  return null
}

export function ListingSchema({ listing }: ListingSchemaProps) {
  const typeLabel = listingTypeLabels[listing.listingType] || listing.listingType
  const price = getPriceValue(listing)
  const priceFormatted = formatPrice(listing)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: listing.title,
    description: listing.description || `${typeLabel} - ${listing.specialty || 'Professionnel de santé'}`,
    url: `${site.url}/annonces/${listing.id}`,
    itemCondition: 'https://schema.org/NewCondition',
    availability: listing.status === 'active'
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    seller: {
      '@type': 'Person',
      name: listing.user?.name || 'Professionnel de santé',
      ...(listing.user?.profession && { jobTitle: listing.user.profession }),
    },
  }

  // Add price if available
  if (price) {
    schema.price = price
    schema.priceCurrency = 'EUR'
    schema.priceSpecification = {
      '@type': 'PriceSpecification',
      price: price,
      priceCurrency: 'EUR',
      ...(listing.listingType === 'replacement' && { unitText: 'jour' }),
    }
  }

  // Add location if available
  if (listing.location) {
    schema.areaServed = {
      '@type': 'Place',
      name: listing.location.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: listing.location.city,
        addressRegion: listing.location.region,
        postalCode: listing.location.postalCode,
        addressCountry: 'FR',
      },
      ...(listing.location.latitude && listing.location.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: parseFloat(listing.location.latitude),
          longitude: parseFloat(listing.location.longitude),
        },
      }),
    }
  }

  // Add dates
  if (listing.publishedAt) {
    schema.validFrom = listing.publishedAt.toISOString()
  }
  if (listing.expiresAt) {
    schema.validThrough = listing.expiresAt.toISOString()
  }

  // Add category based on listing type
  schema.category = `${typeLabel} - ${listing.specialty || 'Santé'}`

  // Add first image if available
  if (listing.media && listing.media.length > 0) {
    schema.image = listing.media[0].fileUrl
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
