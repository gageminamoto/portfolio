'use client'

import * as React from 'react'

import { SearchCommandModal } from '@/components/search/SearchCommandModal'

type CommandKContextType = {
  isOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
}

const CommandKContext = React.createContext<CommandKContextType | null>(null)

export function CommandKProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const openSearch = React.useCallback(() => setIsOpen(true), [])
  const closeSearch = React.useCallback(() => setIsOpen(false), [])
  const toggleSearch = React.useCallback(() => setIsOpen((open) => !open), [])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        event.stopPropagation()
        toggleSearch()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSearch])

  const value = React.useMemo(
    () => ({ isOpen, openSearch, closeSearch, toggleSearch }),
    [closeSearch, isOpen, openSearch, toggleSearch],
  )

  return (
    <CommandKContext.Provider value={value}>
      {children}
      <SearchCommandModal open={isOpen} onOpenChange={setIsOpen} />
    </CommandKContext.Provider>
  )
}

export function useCommandK() {
  const context = React.useContext(CommandKContext)

  if (!context) {
    throw new Error('useCommandK must be used within CommandKProvider.')
  }

  return context
}
