// src/ui/icons/Icon.tsx
import { ICONS } from './IconRegistry'

interface IconProps {
  name: keyof typeof ICONS;
  width?: number;
  height?: number;
  className?: string;
}

export function Icon({ name, width = 16, height = 16, className }: IconProps) {
  const IconComponent = ICONS[name as keyof typeof ICONS]
  return <IconComponent width={width} height={height} className={className} />
}
