import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { 
  CameraIcon, 
  PhotoIcon,
  DocumentIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const ScannerPage: React.FC = () => {
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCameraScan = () => {
    setScanMode('camera');
    // TODO: Implement camera functionality
  };

  const handleUpload = () => {
    setScanMode('upload');
    // TODO: Implement file upload
  };

  const simulateProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // TODO: Show results
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Receipt Scanner
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Quickly add items to your pantry by scanning receipts
        </p>
      </div>

      {!scanMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Camera Option */}
          <Card 
            interactive
            onClick={handleCameraScan}
            className="text-center p-8 hover:shadow-lg transition-shadow"
          >
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
              <CameraIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Take Photo
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Use your camera to scan a receipt in real-time
            </p>
          </Card>

          {/* Upload Option */}
          <Card 
            interactive
            onClick={handleUpload}
            className="text-center p-8 hover:shadow-lg transition-shadow"
          >
            <div className="mx-auto w-16 h-16 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center mb-4">
              <PhotoIcon className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload Image
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a receipt photo from your device
            </p>
          </Card>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <Card className="text-center p-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Processing Receipt...
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            We're extracting items from your receipt. This usually takes a few seconds.
          </p>
        </Card>
      )}

      {/* Recent Scans */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Scans
        </h2>
        <div className="space-y-3">
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Walmart Receipt
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  12 items • 2 hours ago
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </Card>
          
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Target Receipt
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  8 items • Yesterday
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Tips for Better Results
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start">
            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            Ensure the receipt is well-lit and not wrinkled
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            Capture the entire receipt including the top and bottom
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            Hold your device steady and parallel to the receipt
          </li>
        </ul>
      </Card>

      {scanMode && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setScanMode(null)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScannerPage;