import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MemeCard from '../components/MemeCard';
import MemeUploadForm from '../components/MemeUploadForm';
import api from '../services/api';

const Home = () => {
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        fetchMemes();
    }, [sortBy]);

    const fetchMemes = async () => {
        setLoading(true);
        try {
            const endpoint = sortBy === 'trending' ? '/memes/trending' : '/memes';
            const response = await api.get(endpoint);
            setMemes(response.data.memes);
        } catch (error) {
            console.error('Error fetching memes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            {/* Hero Section - Twitter/Instagram Minimalist Style */}
            <section className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <i className="fas fa-robot text-4xl text-blue-500"></i>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                GrokMemeHub
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-base max-w-lg mx-auto">
                            Share and discover the funniest AI & Grok memes from CHRIST University students
                        </p>

                        {isAuthenticated && (
                            <button
                                onClick={() => setShowUploadForm(!showUploadForm)}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <i className="fas fa-plus"></i>
                                Create Meme
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Upload Form */}
            {showUploadForm && isAuthenticated && (
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
                    <MemeUploadForm
                        onSuccess={() => {
                            setShowUploadForm(false);
                            fetchMemes();
                        }}
                    />
                </div>
            )}

            {/* Main Feed */}
            <section className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
                {/* Sort Tabs - Twitter Style */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
                    <button
                        onClick={() => setSortBy('newest')}
                        className={`flex-1 py-4 text-sm font-semibold transition-colors ${sortBy === 'newest'
                                ? 'text-gray-900 dark:text-white border-b-2 border-blue-500'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        Latest
                    </button>
                    <button
                        onClick={() => setSortBy('trending')}
                        className={`flex-1 py-4 text-sm font-semibold transition-colors ${sortBy === 'trending'
                                ? 'text-gray-900 dark:text-white border-b-2 border-blue-500'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        Trending
                    </button>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        {/* Memes Feed - Instagram Style */}
                        {memes.length > 0 ? (
                            <div className="space-y-6">
                                {memes.map((meme) => (
                                    <MemeCard key={meme.id} meme={meme} onUpdate={fetchMemes} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <i className="fas fa-images text-5xl text-gray-300 dark:text-gray-700 mb-4"></i>
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    No memes yet. Be the first to share!
                                </p>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <i className="fas fa-robot text-2xl text-blue-500"></i>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">GrokMemeHub</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                                The AI-powered meme sharing platform for CHRIST University students.
                                Share laughs, spread joy, and celebrate AI humor!
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                            <ul className="space-y-3">
                                <li><Link to="/" className="footer-link">Home</Link></li>
                                <li><Link to="/search" className="footer-link">Search</Link></li>
                                {isAuthenticated && (
                                    <li><Link to="/my-memes" className="footer-link">My Memes</Link></li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
                            <ul className="space-y-3">
                                <li><span className="footer-link cursor-pointer">AI Memes</span></li>
                                <li><span className="footer-link cursor-pointer">Grok Humor</span></li>
                                <li><span className="footer-link cursor-pointer">xAI Content</span></li>
                                <li><span className="footer-link cursor-pointer">Futuristic</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © 2024 GrokMemeHub. Built for CHRIST University.
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="footer-link">Privacy</a>
                            <a href="#" className="footer-link">Terms</a>
                            <a href="#" className="footer-link">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
