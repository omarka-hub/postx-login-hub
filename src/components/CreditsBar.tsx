
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';

interface CreditsBarProps {
  currentCredits: number;
  maxCredits: number;
  accessLevel: string;
}

const CreditsBar: React.FC<CreditsBarProps> = ({ currentCredits, maxCredits, accessLevel }) => {
  const percentage = (currentCredits / maxCredits) * 100;
  
  const getColor = () => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (percentage >= 70) return 'text-green-700';
    if (percentage >= 40) return 'text-orange-700';
    return 'text-red-700';
  };

  const getIcon = () => {
    if (percentage >= 70) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (percentage >= 40) return <Zap className="w-5 h-5 text-orange-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const getBadgeVariant = () => {
    if (percentage >= 70) return 'default';
    if (percentage >= 40) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-6 h-6 text-blue-600" />
          API Credits
        </CardTitle>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {accessLevel} Plan
          </Badge>
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className={`font-semibold ${getTextColor()}`}>
              {currentCredits} / {maxCredits}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Usage</span>
            <span>{percentage.toFixed(1)}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={percentage} 
              className="h-3 bg-gray-100"
            />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ease-in-out ${getColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {percentage >= 70 
            ? "Great! You have plenty of credits remaining." 
            : percentage >= 40 
            ? "You're halfway through your credits for this period." 
            : "Running low on credits. Consider upgrading your plan."
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditsBar;
