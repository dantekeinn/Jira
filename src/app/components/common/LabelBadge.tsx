import React from 'react';
import { Badge } from '../ui/badge';

interface LabelBadgeProps {
  name: string;
  color: string;
}

export const LabelBadge: React.FC<LabelBadgeProps> = ({ name, color }) => {
  return (
    <Badge 
      variant="outline" 
      className="rounded-full px-2 py-0.5 text-xs"
      style={{ 
        borderColor: color, 
        color: color,
        backgroundColor: `${color}10`
      }}
    >
      {name}
    </Badge>
  );
};
