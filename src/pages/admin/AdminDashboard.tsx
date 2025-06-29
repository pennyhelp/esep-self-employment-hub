
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, MapPin, UserCheck, BarChart } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentAdmin, registrations, panchayaths } = useAppStore();

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
      return;
    }
    
    if (currentAdmin.role !== 'super') {
      navigate('/admin/registrations');
      return;
    }
  }, [currentAdmin, navigate]);

  if (!currentAdmin || currentAdmin.role !== 'super') {
    return null;
  }

  const stats = {
    totalRegistrations: registrations.length,
    pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
    approvedRegistrations: registrations.filter(r => r.status === 'approved').length,
    totalPanchayaths: panchayaths.length
  };

  const panchayathStats = panchayaths.map(panchayath => ({
    ...panchayath,
    registrationCount: registrations.filter(r => r.panchayathId === panchayath.id).length
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {currentAdmin.username}! Here's your system overview.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approvedRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Panchayaths</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPanchayaths}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Registration Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage all registrations, approve/reject applications, and export data.
              </p>
              <Button onClick={() => navigate('/admin/registrations')} className="w-full">
                Manage Registrations
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Panchayath Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Add, edit, or remove panchayaths and manage location data.
              </p>
              <Button onClick={() => navigate('/admin/panchayaths')} className="w-full">
                Manage Panchayaths
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage admin users, roles, and access permissions.
              </p>
              <Button onClick={() => navigate('/admin/roles')} className="w-full">
                Manage Admin Roles
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Panchayath-wise Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Panchayath-wise Registration Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {panchayathStats.map((panchayath) => (
                <Card key={panchayath.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{panchayath.name}</h3>
                        <p className="text-sm text-gray-600">{panchayath.district}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {panchayath.registrationCount}
                        </p>
                        <p className="text-xs text-gray-500">registrations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
