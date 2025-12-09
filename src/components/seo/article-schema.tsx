import { site } from '@/config/site'

interface ArticleSchemaProps {
  title: string
  description: string
  slug: string
  featuredImage?: string | null
  authorName?: string | null
  publishedAt?: Date | null
  updatedAt?: Date | null
  tags?: string[] | null
}

export function ArticleSchema({
  title,
  description,
  slug,
  featuredImage,
  authorName,
  publishedAt,
  updatedAt,
  tags,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: `${site.url}/blog/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${site.url}/blog/${slug}`,
    },
    image: featuredImage || `${site.url}/og.jpg`,
    author: {
      '@type': 'Person',
      name: authorName || 'CareEvo',
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: {
        '@type': 'ImageObject',
        url: `${site.url}/logo.png`,
      },
    },
    datePublished: publishedAt?.toISOString() || new Date().toISOString(),
    dateModified: updatedAt?.toISOString() || publishedAt?.toISOString() || new Date().toISOString(),
    inLanguage: 'fr-FR',
    ...(tags && tags.length > 0 && { keywords: tags.join(', ') }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
