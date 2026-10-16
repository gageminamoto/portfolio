/** Row emphasis for fluid list hover: full contrast by default; dim others when the list has hover focus. */
export function getFluidListRowEmphasis<T extends string | number>(
  hoveredId: T | null,
  rowId: T,
  pinnedRowId?: T | null,
): { isEmphasized: boolean; isHighlighted: boolean } {
  const listHasHover = hoveredId !== null
  const isPinned = pinnedRowId != null && pinnedRowId === rowId
  const isHovered = hoveredId === rowId
  const isHighlighted = isHovered || isPinned
  const isEmphasized = !listHasHover || isHovered || isPinned

  return { isEmphasized, isHighlighted }
}
