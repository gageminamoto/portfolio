import { LayoutOne } from "@/components/layouts/layout-one"
import { getMacAppIconImages } from "@/lib/mac-app-icon-images"

export default function Page() {
  return <LayoutOne toolIconImages={getMacAppIconImages()} />
}
