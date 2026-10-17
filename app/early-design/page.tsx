import { EarlyDesignPage } from "@/components/early-design/early-design-page"
import { getEarlyDesignResources } from "@/lib/notion"

export const revalidate = 600

export default async function Page() {
  const resources = await getEarlyDesignResources()
  return <EarlyDesignPage resources={resources} />
}
