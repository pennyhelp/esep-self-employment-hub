
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

const Categories = () => {
  const { categories } = useAppStore();

  const handleCategorySelect = () => {
    // Redirect to home page for registration
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Registration Categories
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Explore all available categories for E-LIFE SOCIETY registration
          </p>
          <Link to="/">
            <Button className="flex items-center gap-2">
              Start Registration <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.filter(cat => cat.isActive).map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onSelect={handleCategorySelect}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">
              Ready to Join E-LIFE SOCIETY?
            </h3>
            <p className="text-blue-700 mb-6">
              Each person can register for one category at a time. Choose the category that best fits your skills and interests.
            </p>
            <Link to="/">
              <Button size="lg" className="flex items-center gap-2 mx-auto">
                Begin Registration Process <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
