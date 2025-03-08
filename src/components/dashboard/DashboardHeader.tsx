
import React from 'react';

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <img 
        src="/lovable-uploads/34960ea5-f71c-4260-85c5-2a45a34637c1.png" 
        alt="StudentHub" 
        className="h-40 object-contain"
      />
    </div>
  );
};

export default DashboardHeader;
