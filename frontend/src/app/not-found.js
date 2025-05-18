import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
      <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center pt-8 sm:justify-start sm:pt-0">
          <div className="px-4 text-lg text-gray-500 border-r border-gray-400 tracking-wider">
            404
          </div>
          <div className="ml-4 text-lg text-gray-500 uppercase tracking-wider">
            Not Found PAGE
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-500 hover:underline">
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
