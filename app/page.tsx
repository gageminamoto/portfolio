import type { Metadata } from "next"
import { LayoutOne } from "@/components/layouts/layout-one"
import { JsonLd, siteJsonLd } from "@/lib/json-ld"
import { SITE_DESCRIPTION, SITE_NAME, pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
})

export default function Page() {
  return (
    <>
      <JsonLd data={siteJsonLd()} />
      <LayoutOne />
    </>
  )
}
