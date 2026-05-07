"use client";

import React from 'react';
import { cn } from '../../utils';
import { PlanCard } from '../PlanCard';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  isRecommended?: boolean;
  description?: string;
}

interface PricingTableProps {
  plans: Plan[];
  className?: string;
}

export const PricingTable: React.FC<PricingTableProps> = ({ plans, className }) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6', className)}>
      {plans.map((plan, idx) => (
        <PlanCard
          key={idx}
          name={plan.name}
          price={plan.price}
          period={plan.period}
          features={plan.features}
          isRecommended={plan.isRecommended}
        />
      ))}
    </div>
  );
};

