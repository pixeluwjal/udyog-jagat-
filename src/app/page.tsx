import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Udyog Jagat - Your Professional Network</title>
        <meta name="description" content="Find your dream job or perfect candidate" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
              <span className="text-blue-600">Udyog</span> Jagat
            </h1>
            <p className="text-xl text-gray-600">
              Connecting talent with opportunity within your professional network
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md mx-auto">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Get Started
              </h2>
              <div className="space-y-4">
                <Link 
                  href="/request-referral"
                  className="block w-full px-6 py-3 text-center font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Request Referral
                </Link>
                <Link 
                  href="/signup"
                  className="block w-full px-6 py-3 text-center font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-200"
                >
                  Create Account
                </Link>
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-4 text-gray-400">or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                <Link 
                  href="/login"
                  className="block w-full px-6 py-3 text-center font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
                >
                  Login to Your Account
                </Link>
              </div>
            </div>
            <div className="bg-gray-50 px-8 py-4 text-center">
              <p className="text-sm text-gray-500">
                Join our professional network today
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">For Job Seekers</h3>
              <p className="text-gray-600">Find your dream job through trusted connections</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">For Recruiters</h3>
              <p className="text-gray-600">Discover qualified candidates in your network</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Referral System</h3>
              <p className="text-gray-600">Leverage your professional connections</p>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}