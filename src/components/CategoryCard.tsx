
import React from 'react';
import { Category } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface CategoryCardProps {
  category: Category;
  onSelect: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  const discount = category.actualFee > 0 ? Math.round(((category.actualFee - category.offerFee) / category.actualFee) * 100) : 0;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => onSelect(category)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {category.name}
          </CardTitle>
          {discount > 0 && (
            <Badge variant="destructive" className="bg-red-500">
              {discount}% OFF
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {category.actualFee > 0 ? (
            <>
              <span className="text-2xl font-bold text-green-600">
                ₹{category.offerFee}
              </span>
              {category.actualFee > category.offerFee && (
                <span className="text-lg text-gray-500 line-through">
                  ₹{category.actualFee}
                </span>
              )}
            </>
          ) : (
            <span className="text-2xl font-bold text-green-600">FREE</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {category.description}
        </p>
        
        <Button className="w-full group-hover:bg-blue-600 transition-colors">
          Register Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
