import Link from 'next/link';

export default function AdminLanding() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card w-full max-w-md p-8 space-y-8 bg-white shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">KULABOUR Admin</h1>
          <p className="text-gray-500">Operations & Dispatch Dashboard</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="admin@kulabour.com"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
              defaultValue="admin@kulabour.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
              defaultValue="password"
            />
          </div>

          <Link href="/admin" className="btn btn-primary w-full py-3 text-base">
            Sign In to Dashboard
          </Link>
        </div>

        <div className="pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Looking for the mobile app?
            <br />
            Download KULABOUR Worker or Customer App.
          </p>
        </div>
      </div>
    </div>
  );
}
