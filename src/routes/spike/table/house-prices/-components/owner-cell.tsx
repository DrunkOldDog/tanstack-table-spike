import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { HouseOwner } from '../-lib/types'

interface OwnerCellProps {
  owner: HouseOwner
}

export function OwnerCell({ owner }: OwnerCellProps) {
  const initials = `${owner.firstName.charAt(0)}${owner.lastName.charAt(0)}`

  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="font-medium truncate">
          {owner.lastName}, {owner.firstName}
        </span>
        <span className="text-xs text-muted-foreground truncate">{owner.email}</span>
      </div>
    </div>
  )
}
