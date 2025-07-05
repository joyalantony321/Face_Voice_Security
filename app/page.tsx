'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Eye, 
  Mic, 
  Building2, 
  UserPlus, 
  Zap, 
  Lock, 
  Scan,
  LogIn,
  UserCheck,
  ArrowRight,
  Code,
  Crown,
  Users,
  CheckCircle,
  Star,
  Globe,
  Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Workspace {
  id: string;
  name: string;
  code: string;
  role: 'admin' | 'user';
  createdDate: string;
}

interface UserAccount {
  email: string;
  password: string;
  workspaces: Workspace[];
}

export default function LandingPage() {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [signupMode, setSignupMode] = useState<'workspace' | 'admin' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceCode, setWorkspaceCode] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userWorkspaces, setUserWorkspaces] = useState<Workspace[]>([]);
  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const [manualWorkspaceCode, setManualWorkspaceCode] = useState('');
  const router = useRouter();

  // Generate random workspace code
  const generateWorkspaceCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Load existing accounts from localStorage
  const loadAccounts = (): UserAccount[] => {
    const accounts = localStorage.getItem('userAccounts');
    return accounts ? JSON.parse(accounts) : [];
  };

  // Save accounts to localStorage
  const saveAccounts = (accounts: UserAccount[]) => {
    localStorage.setItem('userAccounts', JSON.stringify(accounts));
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    
    // Check if user exists
    const accounts = loadAccounts();
    const userAccount = accounts.find(acc => acc.email === email && acc.password === password);
    
    setTimeout(() => {
      if (userAccount) {
        setUserWorkspaces(userAccount.workspaces);
        setShowWorkspaces(true);
        toast.success('Login successful');
      } else {
        toast.error('Invalid email or password');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    if (signupMode === 'workspace' && !workspaceCode.trim()) {
      toast.error('Please enter workspace code');
      return;
    }

    if (signupMode === 'admin' && !workspaceName.trim()) {
      toast.error('Please enter workspace name');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const accounts = loadAccounts();
      let userAccount = accounts.find(acc => acc.email === email);

      if (!userAccount) {
        userAccount = {
          email,
          password,
          workspaces: []
        };
        accounts.push(userAccount);
      }

      if (signupMode === 'admin') {
        const newWorkspace: Workspace = {
          id: Date.now().toString(),
          name: workspaceName,
          code: generateWorkspaceCode(),
          role: 'admin',
          createdDate: new Date().toISOString().split('T')[0]
        };
        userAccount.workspaces.push(newWorkspace);
        toast.success(`Admin workspace created! Code: ${newWorkspace.code}`);
      } else if (signupMode === 'workspace') {
        // Simulate workspace code validation
        const isValidCode = workspaceCode.length === 8;
        if (isValidCode) {
          const newWorkspace: Workspace = {
            id: Date.now().toString(),
            name: `Workspace ${workspaceCode}`,
            code: workspaceCode,
            role: 'user',
            createdDate: new Date().toISOString().split('T')[0]
          };
          userAccount.workspaces.push(newWorkspace);
          toast.success('Successfully joined workspace');
        } else {
          toast.error('Invalid workspace code');
          setIsLoading(false);
          return;
        }
      }

      saveAccounts(accounts);
      setUserWorkspaces(userAccount.workspaces);
      setShowWorkspaces(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleWorkspaceEntry = (workspace: Workspace) => {
    const userData = {
      email,
      password,
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      workspaceCode: workspace.code,
      userType: workspace.role
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    router.push('/workspace');
  };

  const handleManualWorkspaceEntry = () => {
    if (!manualWorkspaceCode.trim()) {
      toast.error('Please enter workspace code');
      return;
    }

    const userData = {
      email,
      password,
      workspaceCode: manualWorkspaceCode,
      workspaceName: `Workspace ${manualWorkspaceCode}`,
      userType: 'user'
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    toast.success('Entering workspace...');
    router.push('/workspace');
  };

  const resetForm = () => {
    setAuthMode(null);
    setSignupMode(null);
    setShowWorkspaces(false);
    setEmail('');
    setPassword('');
    setWorkspaceCode('');
    setWorkspaceName('');
    setManualWorkspaceCode('');
    setUserWorkspaces([]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-30"></div>
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-6xl font-bold font-poppins gradient-text">
                SecureVault Pro
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade biometric authentication platform combining advanced facial recognition 
              and voice pattern analysis for uncompromising security
            </p>
            <div className="flex items-center justify-center mt-6 space-x-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">99.9% Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-600">Enterprise Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">Global Compliance</span>
              </div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <Card className="glass-effect card-hover border-0">
              <CardHeader className="text-center">
                <div className="w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-gray-800 text-xl">Facial Recognition</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  Advanced AI-powered facial recognition with 99.9% accuracy rate using deep learning algorithms
                </p>
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    AI Powered
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect card-hover border-0">
              <CardHeader className="text-center">
                <div className="w-16 h-16 secondary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-gray-800 text-xl">Voice Authentication</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  Unique voice pattern analysis for multi-factor authentication with real-time processing
                </p>
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Real-time
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect card-hover border-0">
              <CardHeader className="text-center">
                <div className="w-16 h-16 success-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-gray-800 text-xl">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  Ultra-fast authentication processing in under 2 seconds with enterprise-grade security
                </p>
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    &lt; 2 seconds
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Authentication Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass-effect border-0 shadow-2xl">
              <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-3xl font-poppins gradient-text mb-4">
                  Access Control Center
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  {showWorkspaces ? 'Select your workspace to continue' : 'Choose your access method to enter the secure environment'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {/* Initial Choice */}
                  {!authMode && !showWorkspaces && (
                    <motion.div
                      key="initial"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid md:grid-cols-2 gap-8"
                    >
                      <Button
                        onClick={() => setAuthMode('login')}
                        className="h-32 text-lg font-semibold primary-gradient hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <LogIn className="w-8 h-8" />
                          <span>Sign In</span>
                          <span className="text-sm opacity-90">Access existing account</span>
                        </div>
                      </Button>

                      <Button
                        onClick={() => setAuthMode('signup')}
                        className="h-32 text-lg font-semibold secondary-gradient hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <UserCheck className="w-8 h-8" />
                          <span>Get Started</span>
                          <span className="text-sm opacity-90">Create new account</span>
                        </div>
                      </Button>
                    </motion.div>
                  )}

                  {/* Login Form */}
                  {authMode === 'login' && !showWorkspaces && (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                          <LogIn className="w-6 h-6 mr-2 text-blue-600" />
                          Sign In to Account
                        </h3>
                        <Button
                          variant="ghost"
                          onClick={resetForm}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Back
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="loginEmail" className="text-gray-700 font-medium">Email Address</Label>
                          <Input
                            id="loginEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="loginPassword" className="text-gray-700 font-medium">Password</Label>
                          <Input
                            id="loginPassword"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full h-14 text-lg font-semibold primary-gradient hover:shadow-lg rounded-xl"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <LogIn className="w-5 h-5" />
                            <span>Sign In</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  )}

                  {/* Signup Mode Selection */}
                  {authMode === 'signup' && !signupMode && !showWorkspaces && (
                    <motion.div
                      key="signupMode"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-gray-800">Choose Account Type</h3>
                        <Button
                          variant="ghost"
                          onClick={resetForm}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Back
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Button
                          onClick={() => setSignupMode('workspace')}
                          className="h-32 text-lg font-semibold primary-gradient hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                        >
                          <div className="flex flex-col items-center space-y-3">
                            <Building2 className="w-8 h-8" />
                            <span>Join Workspace</span>
                            <span className="text-sm opacity-90">Enter existing organization</span>
                          </div>
                        </Button>

                        <Button
                          onClick={() => setSignupMode('admin')}
                          className="h-32 text-lg font-semibold secondary-gradient hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                        >
                          <div className="flex flex-col items-center space-y-3">
                            <UserPlus className="w-8 h-8" />
                            <span>Create Organization</span>
                            <span className="text-sm opacity-90">Set up new workspace</span>
                          </div>
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Signup Form */}
                  {authMode === 'signup' && signupMode && !showWorkspaces && (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                          {signupMode === 'workspace' ? (
                            <>
                              <Building2 className="w-6 h-6 mr-2 text-blue-600" />
                              Join Workspace
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-6 h-6 mr-2 text-purple-600" />
                              Create Organization
                            </>
                          )}
                        </h3>
                        <Button
                          variant="ghost"
                          onClick={() => setSignupMode(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Back
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="signupEmail" className="text-gray-700 font-medium">Email Address</Label>
                            <Input
                              id="signupEmail"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email"
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signupPassword" className="text-gray-700 font-medium">Password</Label>
                            <Input
                              id="signupPassword"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Create password"
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          {signupMode === 'workspace' ? (
                            <div className="space-y-2">
                              <Label htmlFor="workspaceCode" className="text-gray-700 font-medium">Workspace Code</Label>
                              <Input
                                id="workspaceCode"
                                value={workspaceCode}
                                onChange={(e) => setWorkspaceCode(e.target.value)}
                                placeholder="Enter 8-character code"
                                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                maxLength={8}
                              />
                              <p className="text-sm text-gray-500 mt-2">
                                Contact your administrator for the workspace code
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label htmlFor="workspaceName" className="text-gray-700 font-medium">Organization Name</Label>
                              <Input
                                id="workspaceName"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                placeholder="Enter organization name"
                                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              />
                              <p className="text-sm text-gray-500 mt-2">
                                This will be your organization's secure workspace
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={handleSignup}
                        disabled={isLoading}
                        className="w-full h-14 text-lg font-semibold primary-gradient hover:shadow-lg rounded-xl"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Lock className="w-5 h-5" />
                            <span>
                              {signupMode === 'workspace' ? 'Join Workspace' : 'Create Organization'}
                            </span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  )}

                  {/* Workspace Selection */}
                  {showWorkspaces && (
                    <motion.div
                      key="workspaces"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                          <Users className="w-6 h-6 mr-2 text-blue-600" />
                          Your Workspaces
                        </h3>
                        <Button
                          variant="ghost"
                          onClick={resetForm}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Sign Out
                        </Button>
                      </div>

                      {userWorkspaces.length > 0 && (
                        <div className="space-y-4">
                          {userWorkspaces.map((workspace) => (
                            <div
                              key={workspace.id}
                              className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  workspace.role === 'admin' 
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                } shadow-lg`}>
                                  {workspace.role === 'admin' ? (
                                    <Crown className="w-6 h-6 text-white" />
                                  ) : (
                                    <Building2 className="w-6 h-6 text-white" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-gray-800 font-semibold text-lg">{workspace.name}</h4>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant={workspace.role === 'admin' ? 'default' : 'secondary'}>
                                      {workspace.role}
                                    </Badge>
                                    <span className="text-gray-500 text-sm">Code: {workspace.code}</span>
                                  </div>
                                  <p className="text-gray-400 text-xs mt-1">Created: {workspace.createdDate}</p>
                                </div>
                              </div>
                              
                              <Button
                                onClick={() => handleWorkspaceEntry(workspace)}
                                className="primary-gradient hover:shadow-lg rounded-xl"
                              >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Enter
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <Separator className="bg-gray-200" />

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                          <Code className="w-5 h-5 mr-2 text-cyan-600" />
                          Enter Workspace Code
                        </h4>
                        <div className="flex space-x-4">
                          <Input
                            value={manualWorkspaceCode}
                            onChange={(e) => setManualWorkspaceCode(e.target.value)}
                            placeholder="Enter workspace code"
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            maxLength={8}
                          />
                          <Button
                            onClick={handleManualWorkspaceEntry}
                            className="bg-cyan-600 hover:bg-cyan-700 rounded-xl px-6"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="flex items-center justify-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <Scan className="w-5 h-5" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Zero Trust Architecture</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}