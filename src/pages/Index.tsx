
import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Category } from '../types';
import CategoryCard from '../components/CategoryCard';
import RegistrationForm from '../components/RegistrationForm';
import Navbar from '../components/Navbar';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Home } from 'lucide-react';

type ViewState = 'categories' | 'form' | 'success';

const Index = () => {
  const { categories } = useAppStore();
  const [currentView, setCurrentView] = useState<ViewState>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [customerId, setCustomerId] = useState<string>('');

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView('form');
  };

  const handleRegistrationSuccess = (generatedCustomerId: string) => {
    setCustomerId(generatedCustomerId);
    setCurrentView('success');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
  };

  const handleBackToHome = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
    setCustomerId('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'categories' && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                E-LIFE SOCIETY
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Self Employment Registration Program
              </p>
              <p className="text-lg text-gray-500">
                Join Pennyekart - The Hybrid Ecommerce Platform
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Choose Your Registration Category
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.filter(cat => cat.isActive).map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onSelect={handleCategorySelect}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-12 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                About Pennyekart Hybrid Ecommerce
              </h3>
              <p className="text-blue-700">
                Pennyekart connects home delivery service with self-employment programs through E-LIFE SOCIETY. 
                Choose your category based on your business interests and get connected with customers in your area.
              </p>
            </div>
          </>
        )}

        {currentView === 'form' && selectedCategory && (
          <RegistrationForm
            selectedCategory={selectedCategory}
            onBack={handleBackToCategories}
            onSuccess={handleRegistrationSuccess}
          />
        )}

        {currentView === 'success' && (
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-8 pb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Registration Successful!
              </h2>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-lg font-semibold text-green-800 mb-2">
                  Your Customer ID:
                </p>
                <p className="text-2xl font-bold text-green-600 font-mono">
                  {customerId}
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                Please save this Customer ID for future reference. You can check your registration status using this ID.
                Your registration is currently pending approval.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  You will be notified once your registration is approved and payment processing is complete.
                </p>
                <Button onClick={handleBackToHome} className="flex items-center gap-2">
                  <Home size={16} />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
