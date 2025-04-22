import { useEffect, useState, useCallback } from "react";
import { getUserData, getUserPosts } from "../tools/api";
import { UserData, Post } from "../types";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async (uid: string) => {
    if (!uid) {
      setError("Missing user ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch user data
      const response = await getUserData(uid);

      if (response.success && response.user) {
        setUser(response.user as UserData);

        // Fetch user posts
        const postsResponse = await getUserPosts(uid);
        if (postsResponse.success) {
          setUserPosts(postsResponse.posts);
        } else {
          console.error("Failed to fetch user posts:", postsResponse.message);
        }
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId, fetchUserData]);

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500 text-center">User not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Back button */}
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8 text-center">
          {user.displayName || "User"}
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
                <span className="text-gray-400 text-2xl">
                  {user.displayName?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
            )}
          </div>

          {/* Bio Section */}
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-gray-700">
              {user.bio ? user.bio : "No bio available."}
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
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-blue-600 px-2 py-1 rounded-md text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
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

export default UserProfile;
