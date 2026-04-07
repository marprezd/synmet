import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

interface UserProps {
  name?: string | null
  email?: string | null
  avatar?: string | null
}

export default function UserAvatar({ user }: { user: UserProps }) {
  // Get initials from name or email
  const initials = user?.name?.[0] || user?.email?.[0] || '?'

  return (
    <>
      <Avatar className="rounded-lg w-8 h-8">
        <AvatarImage
          src={user?.avatar || ''}
          alt={user?.name || user?.email || ''}
        />
        <AvatarFallback className="rounded-lg">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 grid text-sm text-left leading-tight">
        <span className="font-medium truncate">{user?.name || 'User'}</span>
        {user?.email && (
          <span className="text-zinc-500 dark:text-zinc-400 text-xs truncate">
            {user.email}
          </span>
        )}
      </div>
    </>
  )
}
