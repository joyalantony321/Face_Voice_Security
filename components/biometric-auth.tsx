'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Eye, Mic, Camera, CheckCircle, Loader2, Terminal, Play
} from 'lucide-react';
import { toast } from 'sonner';

interface BiometricAuthProps {
  onAuthComplete: (result: {
    success: boolean;
    username?: string;
    step?: 'face' | 'voice' | 'complete';
    message?: string;
  }) => void;
}

type AuthStep = 'idle' | 'python' | 'processing' | 'complete';

export default function BiometricAuth({ onAuthComplete }: BiometricAuthProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>('idle');
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const runPythonAuthentication = async () => {
    setCurrentStep('python');
    setIsRunning(true);
    setProgress(25);

    try {
      const response = await fetch('http://localhost:8000/api/python/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'authenticate' }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      setProgress(75);
      setCurrentStep('processing');

      setTimeout(() => {
        setProgress(100);
        setCurrentStep('complete');

        if (result.success) {
          onAuthComplete({
            success: true,
            username: result.username,
            step: 'complete',
            message: 'Python biometric authentication successful'
          });
          toast.success(`Welcome back, ${result.username}!`);
        } else {
          onAuthComplete({
            success: false,
            message: result.message || 'Authentication failed'
          });
          toast.error(result.message || 'Authentication failed');
        }

        setIsRunning(false);
      }, 2000);
    } catch (error: any) {
      console.error('Auth error:', error);
      setIsRunning(false);
      setCurrentStep('idle');
      toast.error('Failed to connect to authentication system');
      onAuthComplete({
        success: false,
        message: 'Connection to Python backend failed'
      });
    }
  };

  const resetAuth = () => {
    setCurrentStep('idle');
    setProgress(0);
    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Bar */}
      <Card className="glass-effect">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Python Authentication Progress</h3>
              <Badge variant={currentStep === 'complete' ? 'default' : 'secondary'}>
                {{
                  idle: 'Ready',
                  python: 'Running Python Script',
                  processing: 'Processing Results',
                  complete: 'Complete'
                }[currentStep]}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-gray-400">
              <span className={currentStep !== 'idle' ? 'text-green-400' : ''}>Initialize</span>
              <span className={['processing', 'complete'].includes(currentStep) ? 'text-green-400' : ''}>Execute</span>
              <span className={currentStep === 'complete' ? 'text-green-400' : ''}>Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Python Biometric Integration */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Terminal className="w-6 h-6 mr-2 text-cyan-400" />
            Python Biometric Authentication
          </CardTitle>
          <CardDescription className="text-gray-300">
            Authenticate using live face and voice recognition
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold flex items-center">
                <Camera className="w-5 h-5 mr-2 text-blue-400" /> Camera Requirements
              </h4>
              <ul className="text-gray-300 text-sm list-disc ml-5 mt-1">
                <li>Good lighting</li>
                <li>Clear face view</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold flex items-center">
                <Mic className="w-5 h-5 mr-2 text-purple-400" /> Microphone Requirements
              </h4>
              <ul className="text-gray-300 text-sm list-disc ml-5 mt-1">
                <li>Low background noise</li>
                <li>Clear 4-second voice sample</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg border ${currentStep === 'python' ? 'border-blue-400 bg-blue-400/10' : 'border-gray-600'}`}>
              <Eye className="w-6 h-6 text-blue-400 mb-2" />
              <h5 className="text-white font-medium">Face Recognition</h5>
              <p className="text-gray-400 text-xs">Live webcam analysis</p>
            </div>
            <div className={`p-3 rounded-lg border ${currentStep === 'python' ? 'border-purple-400 bg-purple-400/10' : 'border-gray-600'}`}>
              <Mic className="w-6 h-6 text-purple-400 mb-2" />
              <h5 className="text-white font-medium">Voice Authentication</h5>
              <p className="text-gray-400 text-xs">Microphone recording</p>
            </div>
            <div className={`p-3 rounded-lg border ${['processing', 'complete'].includes(currentStep) ? 'border-green-400 bg-green-400/10' : 'border-gray-600'}`}>
              <CheckCircle className="w-6 h-6 text-green-400 mb-2" />
              <h5 className="text-white font-medium">Verification</h5>
              <p className="text-gray-400 text-xs">Pattern matching</p>
            </div>
          </div>

          <AnimatePresence>
            {currentStep === 'idle' && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Button
                  onClick={runPythonAuthentication}
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Biometric Authentication
                </Button>
              </motion.div>
            )}

            {(currentStep === 'python' || currentStep === 'processing') && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="flex items-center justify-center space-x-3 text-white mb-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg">
                    {currentStep === 'python'
                      ? 'Executing authentication script...'
                      : 'Processing biometric data...'}
                  </span>
                </div>
                <p className="text-gray-400">
                  {currentStep === 'python'
                    ? 'Follow Python prompts (face, then voice)'
                    : 'Matching face and voice data...'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {currentStep !== 'idle' && currentStep !== 'complete' && (
            <Button
              onClick={resetAuth}
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 text-white"
              disabled={isRunning}
            >
              Cancel Authentication
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
