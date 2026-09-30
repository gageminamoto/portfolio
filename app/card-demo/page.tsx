import type { Metadata } from "next"
import { CardRiseDemo } from "@/components/card-rise-demo"

export const metadata: Metadata = {
  title: "Card demo",
  robots: { index: false },
}

export default function CardDemoPage() {
  return <CardRiseDemo />
}
