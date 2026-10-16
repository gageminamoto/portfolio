import type { FocusEvent } from "react"
import {
  fluidHoverHighlightStyle,
  fluidHoverPadStyle,
  fluidHoverTextStyle,
} from "@/lib/hover-constants"
import { getFluidListRowEmphasis } from "@/lib/fluid-list-hover"
import type { ListRowFluidHover } from "@/components/list-row"

export function buildListRowFluidHover<T extends string | number>(
  hoveredId: T | null,
  rowId: T,
  setHoveredId: (id: T | null) => void,
  pinnedRowId?: T | null,
): ListRowFluidHover {
  const { isEmphasized, isHighlighted } = getFluidListRowEmphasis(
    hoveredId,
    rowId,
    pinnedRowId,
  )

  return {
    emphasized: isEmphasized,
    highlighted: isHighlighted,
    padTransitionStyle: fluidHoverPadStyle,
    textTransitionStyle: fluidHoverTextStyle,
    highlightFadeStyle: fluidHoverHighlightStyle,
    onMouseEnter: () => setHoveredId(rowId),
    onFocus: () => setHoveredId(rowId),
    onBlur: (e: FocusEvent<HTMLElement>) => {
      const next = e.relatedTarget
      const row = e.currentTarget
      if (next && row.contains(next)) return
      if (hoveredId === rowId) setHoveredId(null)
    },
  }
}
