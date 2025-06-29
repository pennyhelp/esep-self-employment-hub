
import React, { useEffect, useState } from 'react';
import { useSupabaseStore } from '../store/supabaseStore';
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
import RegistrationForm from '../components/RegistrationForm';
import RegistrationSuccess from '../components/RegistrationSuccess';
import { Category } from '../types';

const Categories = () => {
  const { categories, fetchCategories } = useSupabaseStore();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  if (customerId) {
    return <RegistrationSuccess customerId={customerId} onBackToCategories={() => setCustomerId(null)} />;
  }

  if (selectedCategory) {
    return (
      <RegistrationForm
        selectedCategory={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        onSuccess={(id) => setCustomerId(id)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Registration Category
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select the category that best fits your business needs and start your journey towards self-employment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="transform hover:scale-105 transition-all duration-300">
              <CategoryCard
                category={category}
                onSelect={setSelectedCategory}
              />
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <p className="text-gray-500 text-lg mb-4">No categories available at the moment</p>
              <p className="text-gray-400">Please check back later or contact support</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
