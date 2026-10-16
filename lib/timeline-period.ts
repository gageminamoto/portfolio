const TIMELINE_STATUS_PERIODS = new Set(["Building", "Ongoing", "Shipped"])

function abbrevYear(year: string): string {
  return `${year.slice(-2)}'`
}

/** Mobile-only display: 2024 – 2025 → 24'–25', status words unchanged. */
export function formatTimelinePeriodMobile(period: string): string {
  if (TIMELINE_STATUS_PERIODS.has(period)) {
    return period
  }

  const presentMatch = /^(\d{4}) – Present$/.exec(period)
  if (presentMatch) {
    return `${abbrevYear(presentMatch[1])}–Present`
  }

  const rangeMatch = /^(\d{4}) – (\d{4})$/.exec(period)
  if (rangeMatch) {
    return `${abbrevYear(rangeMatch[1])}–${abbrevYear(rangeMatch[2])}`
  }

  const singleMatch = /^(\d{4})$/.exec(period)
  if (singleMatch) {
    return abbrevYear(singleMatch[1])
  }

  return period
}
