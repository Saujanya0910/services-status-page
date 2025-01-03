import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

export function LoadingScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Bell className="h-12 w-12 text-indigo-600 animate-bounce" />
          <h1 className="text-3xl font-bold text-gray-900">StatusPage</h1>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-600">
            Initializing System{dots}
          </p>
          <p className="text-sm text-gray-500 max-w-md text-center">
            The application is currently initializing its services. This process could take upto 50 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
