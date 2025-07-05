'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Terminal, 
  Play, 
  UserPlus, 
  Shield, 
  CheckCircle, 
  XCircle,
  Loader2,
  Camera,
  Mic,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface PythonIntegrationProps {
  workspaceCode?: string;
  onComplete?: (result: any) => void;
}

export default function PythonIntegration({ workspaceCode, onComplete }: PythonIntegrationProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [userName, setUserName] = useState('');
  const [currentAction, setCurrentAction] = useState<'add_user' | 'authenticate' | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const simulateProgress = (action: string) => {
    setProgress(0);
    const steps = action === 'add_user' 
      ? ['Initializing...', 'Capturing face...', 'Capturing voice...', 'Saving to database...', 'Complete!']
      : ['Initializing...', 'Face recognition...', 'Voice authentication...', 'Verifying...', 'Complete!'];
    
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex]);
        setProgress((stepIndex + 1) * (100 / steps.length));
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
    
    return interval;
  };

  const runPythonScript = async (action: 'add_user' | 'authenticate') => {
    if (action === 'add_user' && !userName.trim()) {
      toast.error('Please enter a user name');
      return;
    }

    setIsRunning(true);
    setCurrentAction(action);
    setOutput('');
    
    const progressInterval = simulateProgress(action);
    
    try {
      const response = await fetch('/api/python/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          userName: action === 'add_user' ? userName : undefined,
          workspaceCode
        }),
      });

      const result = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStep('Complete!');
      
      if (result.success) {
        setOutput(result.output || 'Operation completed successfully');
        toast.success(result.message);
        
        if (action === 'add_user') {
          setUserName(''); // Clear the input
        }
        
        onComplete?.(result);
      } else {
        setOutput(result.error || result.output || 'Operation failed');
        toast.error(result.message || 'Operation failed');
      }
      
    } catch (error) {
      clearInterval(progressInterval);
      const errorMsg = `Failed to execute Python script: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setOutput(errorMsg);
      toast.error(errorMsg);
    } finally {
      setTimeout(() => {
        setIsRunning(false);
        setCurrentAction(null);
        setProgress(0);
        setCurrentStep('');
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card className="glass-effect border-0 border-l-4 border-l-cyan-500">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <Terminal className="w-6 h-6 mr-2 text-cyan-600" />
            Python Biometric System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-blue-600" />
              <span className="text-gray-800">Camera Ready</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-purple-600" />
              <span className="text-gray-800">Microphone Ready</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-600" />
              <span className="text-gray-800">Database Connected</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      {isRunning && (
        <Card className="glass-effect border-0 border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">{currentStep}</span>
                <Badge variant="default">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Running
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add User Section */}
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-green-600" />
            Add User with Biometric Capture
          </CardTitle>
          <CardDescription className="text-gray-600">
            Execute add_delete_admin.py to capture face and voice biometrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-gray-700 font-medium">User Name</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter user name for biometric registration"
              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              disabled={isRunning}
            />
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-amber-800 font-semibold">Live Biometric Capture</h4>
                <p className="text-gray-700 text-sm mt-1">
                  This will activate your camera and microphone to capture live biometric data. 
                  Ensure good lighting and minimal background noise.
                </p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => runPythonScript('add_user')}
            disabled={isRunning || !userName.trim()}
            className="w-full success-gradient hover:shadow-lg h-12 rounded-xl"
          >
            {isRunning && currentAction === 'add_user' ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing Python Script...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Run add_delete_admin.py</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Authentication Section */}
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-600" />
            Biometric Authentication Test
          </CardTitle>
          <CardDescription className="text-gray-600">
            Execute test_login_enhanced.py for face and voice verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
              <Eye className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="text-gray-800 font-medium">Face Recognition</h4>
                <p className="text-gray-600 text-sm">Live camera capture</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
              <Mic className="w-6 h-6 text-purple-600" />
              <div>
                <h4 className="text-gray-800 font-medium">Voice Authentication</h4>
                <p className="text-gray-600 text-sm">Live microphone capture</p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => runPythonScript('authenticate')}
            disabled={isRunning}
            className="w-full primary-gradient hover:shadow-lg h-12 rounded-xl"
          >
            {isRunning && currentAction === 'authenticate' ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Authentication...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Run test_login_enhanced.py</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Python Script Output */}
      {output && (
        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center">
              <Terminal className="w-6 h-6 mr-2 text-cyan-600" />
              Python Script Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-200 max-h-96 overflow-y-auto">
              <pre className="text-cyan-400 text-sm whitespace-pre-wrap font-mono">
                {output}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workspace Info */}
      {workspaceCode && (
        <div className="flex items-center justify-center">
          <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50">
            Active Workspace: {workspaceCode}
          </Badge>
        </div>
      )}
    </div>
  );
}