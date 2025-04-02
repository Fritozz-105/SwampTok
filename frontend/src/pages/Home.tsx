import { useEffect, useState, useRef, useCallback } from 'react';
import { getPosts } from '../tools/api';
import PostCard from '../components/PostCard';
import { Post, ApiResponse } from '../types';

const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const observer = useRef<IntersectionObserver | null>(null);

    const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) {
            return;
        }

        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver(entries => {
            if (entries[0]?.isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) {
            observer.current.observe(node);
        }
    }, [isLoading, hasMore]);

    const fetchPosts = async (pageNum: number) => {
        try {
            setIsLoading(true);

            const response = await getPosts(pageNum);
            const data = response as ApiResponse;

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch posts');
            }

            setPosts(prevPosts =>
                pageNum === 1 ? data.posts : [...prevPosts, ...data.posts]
            );
            setHasMore(data.hasMore);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err instanceof Error ? err.message : 'Failed to load posts');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostUpdate = (updatedPost: Post) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === updatedPost._id ? updatedPost : post
            )
        );
    };

    // Initial load
    useEffect(() => {
        fetchPosts(1);
    }, []);

    // Load more when page changes
    useEffect(() => {
        if (page > 1) {
        fetchPosts(page);
        }
    }, [page]);

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Your Feed</h1>

            <div className="space-y-8">
                {posts.map((post, index) => {
                    if (posts.length === index + 1) {
                        return (
                            <div ref={lastPostElementRef} key={post._id}>
                                <PostCard
                                    post={post}
                                    onPlay={() => {}}
                                    isActive={false}
                                    onPostUpdate={handlePostUpdate}
                                />
                            </div>
                        );
                    } else {
                        return (
                            <PostCard
                                key={post._id}
                                post={post}
                                onPlay={() => {}}
                                isActive={false}
                                onPostUpdate={handlePostUpdate}
                            />
                        );
                    }
                })}
            </div>

            {isLoading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md my-4">
                    {error}
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <p className="text-center text-gray-500 py-6">You've reached the end!</p>
            )}

            {!isLoading && posts.length === 0 && !error && (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-500">No posts available yet.</p>
                    <p className="text-gray-400 mt-2">Be the first to post a video!</p>
                </div>
            )}
        </div>
    );
};

export default Home;
