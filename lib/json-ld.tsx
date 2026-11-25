import { portfolioData } from "@/lib/portfolio-data"
import { PERSON_ID, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site"

type JsonLdData = Record<string, unknown>

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}

export function personJsonLd(): JsonLdData {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: portfolioData.name,
    url: SITE_URL,
    email: `mailto:${portfolioData.email}`,
    image: absoluteUrl("/avatars/gage.png"),
    jobTitle: "Designer",
    description: SITE_DESCRIPTION,
    sameAs: portfolioData.socials.map((social) => social.url),
  }
}

export function siteJsonLd(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
      personJsonLd(),
    ],
  }
}

interface ArticleJsonLdInput {
  title: string
  slug: string
  date: string | null
}

export function articleJsonLd({ title, slug, date }: ArticleJsonLdInput): JsonLdData {
  const url = absoluteUrl(`/writing/${slug}`)

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    url,
    mainEntityOfPage: url,
    ...(date ? { datePublished: date } : {}),
    author: { "@type": "Person", "@id": PERSON_ID, name: portfolioData.name, url: SITE_URL },
    inLanguage: "en",
  }
}
