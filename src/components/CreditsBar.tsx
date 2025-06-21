
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface CreditsBarProps {
  currentCredits: number;
  maxCredits: number;
  accessLevel: string;
}

const CreditsBar: React.FC<CreditsBarProps> = ({ currentCredits, maxCredits, accessLevel }) => {
  const percentage = (currentCredits / maxCredits) * 100;
  
  const getColor = () => {
    if (percentage >= 70) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (percentage >= 40) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  };

  const getTextColor = () => {
    if (percentage >= 70) return 'text-green-700';
    if (percentage >= 40) return 'text-orange-700';
    return 'text-red-700';
  };

  const getBgColor = () => {
    if (percentage >= 70) return 'bg-green-50';
    if (percentage >= 40) return 'bg-orange-50';
    return 'bg-red-50';
  };

  const getBorderColor = () => {
    if (percentage >= 70) return 'border-green-200';
    if (percentage >= 40) return 'border-orange-200';
    return 'border-red-200';
  };

  const getIcon = () => {
    if (percentage >= 70) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (percentage >= 40) return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const getPlanColor = () => {
    switch (accessLevel) {
      case 'FREE': return 'bg-gray-100 text-gray-800';
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'PRO': return 'bg-blue-100 text-blue-800';
      case 'BUSINESS': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`border-0 shadow-lg ${getBgColor()} ${getBorderColor()} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            API Credits
          </CardTitle>
          <Badge className={`${getPlanColor()} text-sm px-3 py-1 font-semibold`}>
            {accessLevel} PLAN
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className={`text-lg font-bold ${getTextColor()}`}>
              {currentCredits} / {maxCredits}
            </span>
          </div>
          <div className={`text-lg font-bold ${getTextColor()}`}>
            {percentage.toFixed(1)}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Progress 
              value={percentage} 
              className="h-4 bg-gray-200"
            />
            <div 
              className={`absolute top-0 left-0 h-4 rounded-full transition-all duration-1000 ease-in-out ${getColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className={`text-sm font-medium p-3 rounded-lg border ${getBgColor()} ${getBorderColor()}`}>
          {percentage >= 70 
            ? "🎉 Excellent! You have plenty of credits remaining for your projects." 
            : percentage >= 40 
            ? "⚡ You're halfway through your credits. Keep an eye on usage." 
            : "⚠️ Running low on credits. Consider upgrading your plan for more capacity."
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditsBar;
