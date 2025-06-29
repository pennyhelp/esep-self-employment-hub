
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseStore } from '../store/supabaseStore';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Index = () => {
  const { 
    announcements, 
    registrations, 
    fetchAnnouncements, 
    fetchRegistrations,
    setupRealtimeSubscriptions 
  } = useSupabaseStore();

  useEffect(() => {
    fetchAnnouncements();
    fetchRegistrations();
    setupRealtimeSubscriptions();
  }, []);

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              E-LIFE SOCIETY
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Join Pennyekart - The Hybrid Ecommerce Platform
            </p>
            <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
              Empowering communities through digital commerce and self-employment opportunities
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/categories">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Start Registration
                </Button>
              </Link>
              <Link to="/status">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Check Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Registration Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-12 w-12 mb-4" />
                <div className="ml-4">
                  <p className="text-blue-100">Total Registrations</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-12 w-12 mb-4" />
                <div className="ml-4">
                  <p className="text-yellow-100">Pending</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-12 w-12 mb-4" />
                <div className="ml-4">
                  <p className="text-green-100">Approved</p>
                  <p className="text-3xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-12 w-12 mb-4" />
                <div className="ml-4">
                  <p className="text-red-100">Rejected</p>
                  <p className="text-3xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Latest Announcements</h2>
          <div className="space-y-6">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-blue-600">{announcement.title}</CardTitle>
                      <Badge variant="secondary">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No announcements available at the moment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of others who have already registered for self-employment opportunities
          </p>
          <Link to="/categories">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Register Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
