
import React from 'react';

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <img 
        src="/lovable-uploads/74823540-2e67-496a-8656-b0ab67bfbdf7.png" 
        alt="StudentHub" 
        className="h-40 object-contain"
      />
    </div>
  );
};

export default DashboardHeader;
