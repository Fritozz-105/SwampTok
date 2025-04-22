import { useEffect, useState, useRef, useCallback } from "react";
import { getUserData, getUserPosts } from "../tools/api";
import { UserData, Post } from "../types";
import Layout from "../components/Layout";

const Profile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const firebaseUidRef = useRef<string>("");

  const fetchUser = useCallback(async () => {
    if (!firebaseUidRef.current) {
      setError("Missing Firebase UID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getUserData(firebaseUidRef.current);

      if (response.success && response.user) {
        setUser(response.user as UserData);

        const postsResponse = await getUserPosts(firebaseUidRef.current);
        if (postsResponse.success) {
          setUserPosts(postsResponse.posts);
        }
      } else {
        setError(response.message || "Failed to fetch user data.");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedFirebaseUid = localStorage.getItem("firebaseUid") || "";
    firebaseUidRef.current = storedFirebaseUid;

    if (storedFirebaseUid) {
      fetchUser();
    } else {
      setError("No Firebase UID found. Please log in.");
    }
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">No user data available.</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {user.displayName || "No name provided"}
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-400">No Photo</span>
              </div>
            )}

            <div className="text-center">
              <p className="text-gray-500 text-sm">
                {user.dateOfBirth
                  ? `Birthday: ${new Date(user.dateOfBirth).toLocaleDateString()}`
                  : "Date of birth: Unknown"}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-gray-700">
              {user.bio ? user.bio : "No bio available."}
            </p>
            <p className="text-gray-600 text-sm">
            {user.followers?.length || 0} Followers · {user.following?.length || 0} Following
            </p>

          </div>

          {/* Interests Section */}
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-3">Interests</h2>
            {user.interests && user.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No interests listed.</p>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 text-center">
            {userPosts.length} Posts
          </h2>

          {userPosts.length === 0 ? (
            <p className="text-gray-500 text-center">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="border p-4 rounded-lg shadow-md flex flex-col bg-white"
                >
                  <video
                    src={post.videoUrl}
                    controls
                    className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover rounded-md mb-4"
                  />
                  {post.caption && (
                    <p className="font-semibold break-words">{post.caption}</p>
                  )}
                  {post.tags && (
                    <p className="text-sm text-gray-400 mt-1 break-words">
                      {post.tags}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
