"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SocialIcon } from "@/components/social-icon"
import type { Hero, PromotionRequest } from "@/lib/mock-data"
import { stripProtocol } from "@/lib/utils"
import { Globe } from "@phosphor-icons/react"

interface RequestSidebarProps {
  request: PromotionRequest
  otherParty: Hero
}

export function RequestSidebar({
  request,
  otherParty,
}: RequestSidebarProps) {
  const initials = otherParty.name.charAt(0)

  return (
    <div className="space-y-6">
      {/* Identity + bio */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium">{otherParty.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {otherParty.role === "both" ? "sponsor" : otherParty.role}
            </p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {otherParty.bio}
        </p>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Category</p>
        <Badge variant="outline" className="text-xs">
          {otherParty.verticals[0]}
        </Badge>
      </div>

      {/* Links */}
      {(otherParty.website || otherParty.socialLinks.length > 0) && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Links</p>
          <div className="flex flex-wrap gap-1.5">
            {otherParty.website && (
              <Badge variant="outline" className="text-xs" asChild>
                <a href={otherParty.website}>
                  <Globe className="size-3" />
                  {stripProtocol(otherParty.website)}
                </a>
              </Badge>
            )}
            {otherParty.socialLinks.map((link) => (
              <Badge key={link.platform} variant="outline" className="text-xs capitalize" asChild>
                <a href={link.url}>
                  <SocialIcon platform={link.platform} className="size-3" />
                  {link.platform}
                </a>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
