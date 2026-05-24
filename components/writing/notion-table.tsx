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
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
        {headerRow && (
          <thead>
            <tr className="bg-muted/40">
              {headerRow.table_row.cells.map((cell, index) => (
                <th key={index} className="border-b border-r border-border px-3 py-2 font-medium text-foreground last:border-r-0">
                  <NotionRichText items={cell} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {bodyRows.map((row, rowIndex) => (
            <tr key={row.id} className="align-top">
              {row.table_row.cells.map((cell, index) => {
                const isLastBodyRow = rowIndex === bodyRows.length - 1
                const CellTag = headerRow ? "td" : "th"
                return (
                  <CellTag
                    key={index}
                    className={`border-r border-b border-border px-3 py-2 text-foreground/90 first:whitespace-nowrap last:border-r-0 ${isLastBodyRow ? "border-b-0" : ""}`}
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
