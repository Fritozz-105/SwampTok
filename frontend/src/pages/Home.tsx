import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 gap-4">
            <h1 className="text-2xl text-black ">I am Home</h1>
            <button className="bg-amber-300 hover:bg-amber-700 rounded-lg" onClick={() => navigate('/login')}>Login</button>
        </div>
    );
};

export default Home;
