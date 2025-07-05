'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Eye, 
  Mic, 
  Users, 
  Settings, 
  LogOut, 
  UserPlus, 
  Scan,
  CheckCircle,
  Home,
  Code,
  Crown,
  Terminal,
  Copy,
  Activity,
  BarChart3,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UserManagement from '@/components/user-management';
import BiometricAuth from '@/components/biometric-auth';
import PythonIntegration from '@/components/python-integration';

interface UserData {
  email: string;
  password: string;
  workspaceId?: string;
  workspaceCode?: string;
  workspaceName?: string;
  userType: 'user' | 'admin';
}

export default function WorkspacePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'userManagement' | 'biometricAuth' | 'adminSettings' | 'pythonIntegration'>('dashboard');
  const [authResult, setAuthResult] = useState<{
    success: boolean;
    username?: string;
    step?: 'face' | 'voice' | 'complete';
    message?: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (!storedData) {
      router.push('/');
      return;
    }
    setUserData(JSON.parse(storedData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleAuthComplete = (result: any) => {
    setAuthResult(result);
    if (result.success) {
      toast.success(`Welcome back, ${result.username}!`);
    } else {
      toast.error(result.message || 'Authentication failed');
    }
  };

  const resetAuth = () => {
    setAuthResult(null);
    setCurrentView('dashboard');
  };

  const copyWorkspaceCode = () => {
    if (userData?.workspaceCode) {
      navigator.clipboard.writeText(userData.workspaceCode);
      toast.success('Workspace code copied to clipboard');
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-poppins text-gray-800">
                    {userData.workspaceName || `Workspace ${userData.workspaceCode}`}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600">
                      {userData.userType === 'admin' ? 'Administrator' : 'User'} • {userData.email}
                    </p>
                    {userData.workspaceCode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyWorkspaceCode}
                        className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
                      >
                        <Code className="w-3 h-3 mr-1" />
                        {userData.workspaceCode}
                        <Copy className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant={userData.userType === 'admin' ? 'default' : 'secondary'} className="px-3 py-1">
                  {userData.userType === 'admin' ? (
                    <div className="flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>Admin</span>
                    </div>
                  ) : (
                    'User'
                  )}
                </Badge>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && !authResult && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Quick Stats */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card className="glass-effect border-0 card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Active Users</p>
                          <p className="text-2xl font-bold text-gray-800">24</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-0 card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Success Rate</p>
                          <p className="text-2xl font-bold text-gray-800">99.2%</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-0 card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Today's Logins</p>
                          <p className="text-2xl font-bold text-gray-800">156</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Activity className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-0 card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Avg Response</p>
                          <p className="text-2xl font-bold text-gray-800">1.2s</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <CardTitle className="text-gray-800 flex items-center">
                      <Scan className="w-6 h-6 mr-2 text-blue-600" />
                      Security Dashboard
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Access biometric authentication and manage your secure workspace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Button
                        onClick={() => setCurrentView('pythonIntegration')}
                        className="h-24 primary-gradient hover:shadow-xl transition-all duration-300 rounded-xl"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <Terminal className="w-6 h-6" />
                          <span className="font-semibold">Python Auth</span>
                        </div>
                      </Button>

                      <Button
                        onClick={() => setCurrentView('biometricAuth')}
                        variant="outline"
                        className="h-24 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center space-x-2">
                            <Eye className="w-5 h-5" />
                            <Mic className="w-5 h-5" />
                          </div>
                          <span className="font-semibold">Web Auth</span>
                        </div>
                      </Button>

                      {userData.userType === 'admin' && (
                        <>
                          <Button
                            onClick={() => setCurrentView('userManagement')}
                            variant="outline"
                            className="h-24 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <Users className="w-6 h-6" />
                              <span className="font-semibold">Manage Users</span>
                            </div>
                          </Button>

                          <Button
                            onClick={() => setCurrentView('adminSettings')}
                            variant="outline"
                            className="h-24 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <Settings className="w-6 h-6" />
                              <span className="font-semibold">Settings</span>
                            </div>
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Workspace Code Display */}
                {userData.userType === 'admin' && userData.workspaceCode && (
                  <Card className="glass-effect border-0 border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="text-gray-800 flex items-center">
                        <Crown className="w-6 h-6 mr-2 text-purple-600" />
                        Admin Workspace Information
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Share this code with team members to join your workspace
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-6 bg-purple-50 rounded-xl border border-purple-200">
                        <div>
                          <h4 className="text-gray-800 font-semibold">Workspace Code</h4>
                          <p className="text-3xl font-mono text-purple-600 font-bold">{userData.workspaceCode}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Users need this code to join your workspace
                          </p>
                        </div>
                        <Button
                          onClick={copyWorkspaceCode}
                          className="bg-purple-600 hover:bg-purple-700 rounded-xl"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Security Features */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="glass-effect border-0">
                    <CardHeader>
                      <Eye className="w-8 h-8 text-blue-600 mb-2" />
                      <CardTitle className="text-gray-800">Facial Recognition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">
                        Python-powered facial recognition with OpenCV and MediaPipe
                      </p>
                      <div className="mt-4 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-0">
                    <CardHeader>
                      <Mic className="w-8 h-8 text-purple-600 mb-2" />
                      <CardTitle className="text-gray-800">Voice Authentication</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">
                        Voice pattern analysis using Resemblyzer and librosa
                      </p>
                      <div className="mt-4 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-0">
                    <CardHeader>
                      <Shield className="w-8 h-8 text-cyan-600 mb-2" />
                      <CardTitle className="text-gray-800">Database Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">
                        Biometric data stored securely with workspace isolation
                      </p>
                      <div className="mt-4 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-green-600">Connected</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {currentView === 'pythonIntegration' && (
              <motion.div
                key="pythonIntegration"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">Python Biometric System</h2>
                  <Button
                    onClick={() => setCurrentView('dashboard')}
                    variant="outline"
                    className="border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </div>
                <PythonIntegration 
                  workspaceCode={userData.workspaceCode}
                  onComplete={handleAuthComplete}
                />
              </motion.div>
            )}

            {currentView === 'userManagement' && (
              <motion.div
                key="userManagement"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => setCurrentView('pythonIntegration')}
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50 rounded-xl"
                    >
                      <Terminal className="w-4 h-4 mr-2" />
                      Python Scripts
                    </Button>
                    <Button
                      onClick={() => setCurrentView('dashboard')}
                      variant="outline"
                      className="border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
                <UserManagement />
              </motion.div>
            )}

            {currentView === 'adminSettings' && (
              <motion.div
                key="adminSettings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">Admin Settings</h2>
                  <Button
                    onClick={() => setCurrentView('dashboard')}
                    variant="outline"
                    className="border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </div>

                <div className="grid gap-6">
                  <Card className="glass-effect border-0">
                    <CardHeader>
                      <CardTitle className="text-gray-800 flex items-center">
                        <Code className="w-6 h-6 mr-2 text-purple-600" />
                        Workspace Configuration
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Manage your workspace settings and access codes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-gray-700 font-medium">Workspace Name</label>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-800">{userData.workspaceName}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-gray-700 font-medium">Workspace Code</label>
                          <div className="flex items-center space-x-2">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex-1">
                              <p className="text-purple-600 font-mono font-bold">{userData.workspaceCode}</p>
                            </div>
                            <Button
                              onClick={copyWorkspaceCode}
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 rounded-xl"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-0">
                    <CardHeader>
                      <CardTitle className="text-gray-800 flex items-center">
                        <Terminal className="w-6 h-6 mr-2 text-green-600" />
                        Python Script Information
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Direct integration with your Python biometric authentication system
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="text-green-700 font-semibold mb-2">add_delete_admin.py</h4>
                          <p className="text-gray-600 text-sm">
                            Captures live biometric data (face + voice) and stores in db.json with workspace association
                          </p>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="text-blue-700 font-semibold mb-2">test_login_enhanced.py</h4>
                          <p className="text-gray-600 text-sm">
                            Performs live biometric authentication by comparing captured data with stored embeddings
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {currentView === 'biometricAuth' && !authResult && (
              <motion.div
                key="biometricAuth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">Web Biometric Authentication</h2>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => setCurrentView('pythonIntegration')}
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl"
                    >
                      <Terminal className="w-4 h-4 mr-2" />
                      Use Python Instead
                    </Button>
                    <Button
                      onClick={() => setCurrentView('dashboard')}
                      variant="outline"
                      className="border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
                <BiometricAuth onAuthComplete={handleAuthComplete} />
              </motion.div>
            )}

            {authResult && (
              <motion.div
                key="authResult"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-center min-h-[60vh]"
              >
                <Card className="glass-effect border-0 max-w-md w-full text-center shadow-2xl">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      {authResult.success ? (
                        <CheckCircle className="w-16 h-16 text-green-500" />
                      ) : (
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-500 text-2xl">✕</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className={`text-2xl ${authResult.success ? 'text-green-600' : 'text-red-600'}`}>
                      {authResult.success ? 'Authentication Successful' : 'Authentication Failed'}
                    </CardTitle>
                    {authResult.username && (
                      <CardDescription className="text-lg text-gray-800">
                        Welcome back, {authResult.username}!
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {authResult.message && (
                      <p className="text-gray-600">{authResult.message}</p>
                    )}
                    
                    <div className="flex flex-col space-y-3">
                      {!authResult.success && (
                        <Button
                          onClick={() => setCurrentView('pythonIntegration')}
                          className="primary-gradient rounded-xl"
                        >
                          <Terminal className="w-4 h-4 mr-2" />
                          Try Again with Python
                        </Button>
                      )}
                      
                      <Button
                        onClick={resetAuth}
                        variant="outline"
                        className="border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl"
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Back to Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}