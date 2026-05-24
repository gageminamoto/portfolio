import type { NotionBlock } from "@/lib/notion"
import { NotionRichText } from "./notion-rich-text"

type TableBlock = Extract<NotionBlock, { type: "table" }>
type TableRowBlock = Extract<NotionBlock, { type: "table_row" }>

interface NotionTableProps {
  block: TableBlock
}

function isTableRowBlock(block: NotionBlock): block is TableRowBlock {
  return block.type === "table_row"
}

export function NotionTable({ block }: NotionTableProps) {
  const rows = (block.children ?? []).filter(isTableRowBlock)

  if (rows.length === 0) {
    return null
  }

  const headerRow = block.table.has_column_header ? rows[0] : null
  const bodyRows = block.table.has_column_header ? rows.slice(1) : rows

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
        {headerRow && (
          <thead>
            <tr className="border border-border bg-muted/40">
              {headerRow.table_row.cells.map((cell, index) => (
                <th key={index} className="border border-border px-3 py-2 font-medium text-foreground">
                  <NotionRichText items={cell} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {bodyRows.map((row) => (
            <tr key={row.id} className="border border-border align-top">
              {row.table_row.cells.map((cell, index) => {
                const CellTag = headerRow ? "td" : "th"
                return (
                  <CellTag
                    key={index}
                    className="border border-border px-3 py-2 text-foreground/90 first:whitespace-nowrap"
                  >
                    <NotionRichText items={cell} />
                  </CellTag>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
