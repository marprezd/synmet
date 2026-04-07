import { Search } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { SidebarInput } from '@/components/ui/sidebar'

export function SearchForm({ ...props }: React.ComponentProps<'form'>) {
  return (
    <form {...props}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Type to search..."
          className="pl-7 h-8"
        />
        <Search className="top-1/2 left-2 absolute opacity-50 size-4 -translate-y-1/2 pointer-events-none select-none" />
      </div>
    </form>
  )
}
