import type { Metadata } from "next"
import { portfolioData } from "@/lib/portfolio-data"

export const SITE_URL = "https://gageminamoto.com"
export const SITE_NAME = portfolioData.name
export const SITE_DESCRIPTION = "Designer building everyday products. Growing Hawai'i's local design community."
export const TWITTER_HANDLE = "@gageminamoto"
export const PERSON_ID = `${SITE_URL}/#person`

export const PUBLIC_PAGES = {
  home: { path: "/", name: "Home", description: SITE_DESCRIPTION },
  about: { path: "/about", name: "About", description: "Designer based in Hawai'i, focused on building everyday products." },
  writing: { path: "/writing", name: "Writing", description: "Writing by Gage Minamoto." },
  tools: { path: "/tools", name: "Tools", description: "Everything I build with, stay productive, and keep learning." },
  earlyDesign: { path: "/early-design", name: "Early design resources", description: "A short reading list for people new to design." },
} as const

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString()
}

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  socialTitle?: string
}

export function pageMetadata({ title, description, path, socialTitle = title }: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: socialTitle,
      description,
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
      creator: TWITTER_HANDLE,
    },
  }
}
