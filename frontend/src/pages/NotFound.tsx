
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
      <h1 className="text-4xl font-bold text-gray-900">404 - Page Not Found</h1>
      <p className="mt-3 text-xl text-gray-500">
        Sorry, the page you are looking for does not exist.
      </p>
      {/* <Link to="/" className="mt-6 text-blue-600 hover:underline">
        Go back to Home
      </Link> */}
    </div>
  );
}