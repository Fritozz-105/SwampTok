import Sidebar from "../components/Sidebar";

const Profile = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 h-60 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/profile-bg.jpg')", // Replace with dynamic user background
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <main className="relative z-10 min-h-screen p-6">
          <div className="flex items-center gap-6">
            {/* Profile Picture and Information */}
            <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-300 border-4 border-white shadow-lg">
              <img
                src="https://via.placeholder.com/150" // Replace with dynamic user image URL
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">F-name L-name</h1>
              <p className="text-lg text-gray-200">user-ID</p>
              <p className="text-sm text-gray-300">Joined in 2025</p>
            </div>
          </div>

          {/* User Bio Section */}
          <div className="mt-20 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">About Me</h2>
            <p className="text-gray-600 mt-3">Misc</p>
          </div>

          {/* Tabs or Additional Content Section */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">My Posts</h2>
            <div className="mt-4">
              <ul>
                <li className="text-blue-600 hover:underline cursor-pointer">
                  First Post Title
                </li>
                <li className="text-blue-600 hover:underline cursor-pointer">
                  Second Post Title
                </li>
                {/* Add more posts here */}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
