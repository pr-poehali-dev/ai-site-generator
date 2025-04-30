
import React from 'react';
import * as Icons from 'lucide-react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof Icons | string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  fallback?: keyof typeof Icons;
}

const Icon: React.FC<IconProps> = ({
  name,
  color,
  size = 24,
  strokeWidth = 2,
  className = '',
  fallback = 'HelpCircle',
  ...props
}) => {
  // Получаем иконку из библиотеки lucide-react
  const LucideIcon = Icons[name as keyof typeof Icons] || Icons[fallback];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react. Using fallback "${fallback}".`);
  }

  return (
    <LucideIcon
      color={color}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
};

export default Icon;
