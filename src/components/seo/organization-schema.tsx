import { site } from '@/config/site'

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    description: 'CareEvo est la plateforme de référence pour les professionnels de santé en France. Trouvez des opportunités de cession, remplacement et collaboration.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: site.mailSupport,
      contactType: 'customer service',
      availableLanguage: 'French',
    },
    sameAs: [
      site.links.twitter,
      site.links.linkedin,
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
