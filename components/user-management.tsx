'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  UserPlus, UserMinus, Users, Trash2, Plus,
  AlertTriangle, CheckCircle, Camera, Mic,
  Loader2, Terminal, AlertCircle, RefreshCw,
  Database, Eye, Volume2
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending';
  addedDate: string;
  hasFaceData?: boolean;
  hasVoiceData?: boolean;
  faceEmbeddings?: number;
  voiceEmbeddings?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default function UserManagement() {
  const [currentAction, setCurrentAction] = useState<'add' | 'delete' | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from db.json on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/users');
      const result = await response.json();

      if (result.success) {
        setUsers(result.users);
        setDebugInfo({
          message: result.message,
          totalUsers: result.totalUsers,
          source: 'db.json',
          timestamp: new Date().toISOString()
        });
      } else {
        toast.error('Failed to fetch users from database');
        setDebugInfo({
          error: result.message,
          source: 'db.json',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      toast.error('Failed to connect to database');
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'network',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddUser = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      toast.error('Please enter both name and email');
      return;
    }

    setIsLoading(true);
    setDebugInfo(null);

    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const workspaceCode = userData.workspaceCode || 'default';

      const response = await fetch(`${API_BASE}/api/python/add-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          workspaceCode
        }),
      });

      const result = await response.json();
      setDebugInfo(result.debug || result);

      if (result.success) {
        const newUser: User = {
          id: Date.now().toString(),
          name: userName,
          email: userEmail,
          status: 'active',
          addedDate: new Date().toISOString().split('T')[0]
        };
        setUsers(prev => [...prev, newUser]);
        setUserName('');
        setUserEmail('');
        setCurrentAction(null);
        toast.success(`User ${userName} added successfully with biometric data!`);
        // Refresh users list to get updated data from db.json
        setTimeout(() => fetchUsers(), 2000);
      } else {
        toast.error(result.message || 'Failed to add user');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to connect to backend: ' + message);
      setDebugInfo({ error: message, type: 'network_error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/python/delete-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName }),
      });

      const result = await response.json();

      if (result.success) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        toast.success(`User ${userName} deleted successfully`);
        // Refresh users list to get updated data from db.json
        setTimeout(() => fetchUsers(), 1000);
      } else {
        toast.error(result.message || 'Delete failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to delete user: ' + message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 px-2 md:px-0">
      {/* Database Status & Refresh */}
      <Card className="glass-effect-strong border-emerald-500/30">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <CardTitle className="text-emerald-400 flex items-center text-lg md:text-xl">
              <Database className="w-5 h-5 mr-2" />
              Database Status
            </CardTitle>
            <Button
              onClick={fetchUsers}
              disabled={isRefreshing}
              className="button-modern text-sm px-3 py-2 self-start md:self-auto"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-emerald-500/10 p-3 rounded-lg">
              <div className="text-emerald-400 font-semibold">Total Users</div>
              <div className="text-gray-900 text-2xl font-bold">{users.length}</div>
            </div>
            <div className="bg-teal-500/10 p-3 rounded-lg">
              <div className="text-teal-400 font-semibold">Active Users</div>
              <div className="text-gray-900 text-2xl font-bold">
                {users.filter(u => u.status === 'active').length}
              </div>
            </div>
            <div className="bg-cyan-500/10 p-3 rounded-lg">
              <div className="text-cyan-400 font-semibold">Data Source</div>
              <div className="text-gray-900 text-lg font-semibold">db.json</div>
            </div>
          </div>
          {debugInfo && (
            <details className="mt-4">
              <summary className="text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                Debug Information
              </summary>
              <pre className="text-xs text-gray-700 bg-black/30 p-3 rounded mt-2 overflow-auto max-h-32">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>

      {/* Action Cards */}
      {!currentAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          <Card className="glass-effect card-hover shimmer-effect relative overflow-hidden">
            <CardHeader className="text-center">
              <UserPlus className="w-10 h-10 md:w-12 md:h-12 text-emerald-400 mb-4 mx-auto" />
              <CardTitle className="text-gray-900 text-lg md:text-xl">Add User with Biometrics</CardTitle>
              <CardDescription className="text-gray-700 text-sm md:text-base">
                Register users using face and voice capture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setCurrentAction('add')}
                className="w-full button-modern text-sm md:text-base"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect card-hover shimmer-effect relative overflow-hidden">
            <CardHeader className="text-center">
              <UserMinus className="w-10 h-10 md:w-12 md:h-12 text-rose-400 mb-4 mx-auto" />
              <CardTitle className="text-gray-900 text-lg md:text-xl">Delete User</CardTitle>
              <CardDescription className="text-gray-700 text-sm md:text-base">
                Remove users from the biometric system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setCurrentAction('delete')}
                className="w-full button-coral text-sm md:text-base"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Add User Form */}
      <AnimatePresence>
        {currentAction === 'add' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-effect-strong">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-2 md:space-y-0">
                  <div>
                    <CardTitle className="text-gray-900 flex items-center text-lg md:text-xl">
                      <UserPlus className="w-5 h-5 md:w-6 md:h-6 mr-2 text-emerald-400" />
                      Add User with Live Biometric Capture
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-sm md:text-base">
                      Python script will capture the user's face and voice.
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentAction(null)}
                    className="text-gray-600 hover:text-gray-900 self-start md:self-auto"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <Label htmlFor="userName" className="text-gray-900 text-sm md:text-base">Full Name</Label>
                    <Input
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter full name"
                      className="bg-white/10 border-white/20 text-black mt-1"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail" className="text-gray-900 text-sm md:text-base">Email Address</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Enter email"
                      className="bg-white/10 border-white/20 text-black mt-1"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <Camera className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                    <div>
                      <h4 className="text-gray-900 font-medium text-sm md:text-base">Camera Required</h4>
                      <p className="text-gray-600 text-xs md:text-sm">Used for face recognition</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-teal-500/10 rounded-lg border border-teal-500/20">
                    <Mic className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                    <div>
                      <h4 className="text-gray-900 font-medium text-sm md:text-base">Microphone Required</h4>
                      <p className="text-gray-600 text-xs md:text-sm">Used for voice authentication</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAddUser}
                  disabled={isLoading || !userName.trim() || !userEmail.trim()}
                  className="w-full button-modern h-10 md:h-12 text-sm md:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registering...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Start Biometric Registration</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete User Form */}
      <AnimatePresence>
        {currentAction === 'delete' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-effect-strong">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                  <CardTitle className="text-gray-900 flex items-center text-lg md:text-xl">
                    <UserMinus className="w-5 h-5 md:w-6 md:h-6 mr-2 text-rose-400" />
                    Delete Users
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentAction(null)}
                    className="text-gray-600 hover:text-gray-900 self-start md:self-auto"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600">No users found in database</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-white/5 rounded-lg border border-white/10 space-y-3 md:space-y-0">
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm md:text-base">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-gray-900 font-semibold text-sm md:text-base">{user.name}</h4>
                          <p className="text-gray-600 text-xs md:text-sm">{user.email}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <p className="text-gray-500 text-xs">Added: {user.addedDate}</p>
                            {user.hasFaceData && (
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3 text-emerald-400" />
                                <span className="text-xs text-emerald-400">{user.faceEmbeddings}</span>
                              </div>
                            )}
                            {user.hasVoiceData && (
                              <div className="flex items-center space-x-1">
                                <Volume2 className="w-3 h-3 text-teal-400" />
                                <span className="text-xs text-teal-400">{user.voiceEmbeddings}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end space-x-3">
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {user.status}
                        </Badge>
                        <Button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={isLoading}
                          className="button-coral text-xs px-3 py-1"
                          size="sm"
                        >
                          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview */}
      {!currentAction && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-effect-strong">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center text-lg md:text-xl">
                <Users className="w-5 h-5 md:w-6 md:h-6 mr-2 text-emerald-400" />
                Current Users ({users.length})
              </CardTitle>
              <CardDescription className="text-gray-700 text-sm md:text-base">
                All users enrolled in the biometric system from db.json
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No users found in database</p>
                  <p className="text-gray-500 text-sm">Add users to see them listed here</p>
                </div>
              ) : (
                <div className="grid gap-3 md:gap-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 bg-white/5 rounded-lg border border-white/10 space-y-2 md:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm md:text-base font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-gray-900 font-medium text-sm md:text-base">{user.name}</h4>
                          <p className="text-gray-600 text-xs md:text-sm">{user.email}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {user.hasFaceData && (
                              <div className="flex items-center space-x-1 bg-emerald-500/20 px-2 py-1 rounded text-xs">
                                <Eye className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Face: {user.faceEmbeddings}</span>
                              </div>
                            )}
                            {user.hasVoiceData && (
                              <div className="flex items-center space-x-1 bg-teal-500/20 px-2 py-1 rounded text-xs">
                                <Volume2 className="w-3 h-3 text-teal-400" />
                                <span className="text-teal-400">Voice: {user.voiceEmbeddings}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end space-x-2">
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {user.status}
                        </Badge>
                        {user.status === 'active' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
