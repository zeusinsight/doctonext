import { site } from '@/config/site'

interface BreadcrumbItem {
  name: string
  url?: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url.startsWith('http') ? item.url : `${site.url}${item.url}` }),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Pre-built breadcrumb configurations for common pages
export function ListingBreadcrumb({
  listingType,
  title
}: {
  listingType: string
  title: string
}) {
  const typeLabels: Record<string, string> = {
    transfer: 'Cessions',
    replacement: 'Remplacements',
    collaboration: 'Collaborations',
  }

  return (
    <BreadcrumbSchema
      items={[
        { name: 'Accueil', url: '/' },
        { name: 'Annonces', url: '/annonces' },
        { name: typeLabels[listingType] || 'Annonces', url: `/annonces?type=${listingType}` },
        { name: title },
      ]}
    />
  )
}

export function BlogBreadcrumb({ title }: { title: string }) {
  return (
    <BreadcrumbSchema
      items={[
        { name: 'Accueil', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: title },
      ]}
    />
  )
}

export function SimpleBreadcrumb({ pageName }: { pageName: string }) {
  return (
    <BreadcrumbSchema
      items={[
        { name: 'Accueil', url: '/' },
        { name: pageName },
      ]}
    />
  )
}
