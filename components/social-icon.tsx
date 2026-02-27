import {
  TwitterLogo,
  InstagramLogo,
  YoutubeLogo,
  LinkedinLogo,
  TiktokLogo,
  DribbbleLogo,
  Globe,
} from "@phosphor-icons/react"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: TwitterLogo,
  instagram: InstagramLogo,
  youtube: YoutubeLogo,
  linkedin: LinkedinLogo,
  tiktok: TiktokLogo,
  dribbble: DribbbleLogo,
}

export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const Icon = ICONS[platform.toLowerCase()] ?? Globe
  return <Icon className={className} />
}
