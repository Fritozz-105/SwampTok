import Sidebar from '../components/Sidebar';

const Home = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 w-full">
                <main className="min-h-screen p-6">
                    <h1 className="text-2xl font-bold">Home Page Content</h1>
                </main>
            </div>
        </div>
    );
};

export default Home;
