
import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (password: string): number => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    return strength;
  };

  const getStrengthText = (strength: number): string => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    if (strength <= 4) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = (strength: number): string => {
    if (strength === 0) return 'bg-gray-200';
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-orange-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const strength = calculateStrength(password);
  const percentage = password ? Math.max((strength / 5) * 100, 10) : 0;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Password Strength</span>
        <span className={`text-xs font-medium ${
          strength <= 2 ? 'text-red-500' : 
          strength <= 3 ? 'text-orange-500' : 
          strength <= 4 ? 'text-yellow-500' : 'text-green-500'
        }`}>
          {getStrengthText(strength)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ease-out ${getStrengthColor(strength)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
