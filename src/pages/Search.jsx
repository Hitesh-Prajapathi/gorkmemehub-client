import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MemeCard from '../components/MemeCard';
import api from '../services/api';

const Search = () => {
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showNearby, setShowNearby] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        fetchMemes();
    }, [selectedCategory]);

    const fetchMemes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory) params.append('category', selectedCategory);

            const response = await api.get(`/memes?${params.toString()}`);
            setMemes(response.data.memes);
        } catch (error) {
            console.error('Error fetching memes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNearbyMemes = async () => {
        if (!isAuthenticated) {
            alert('Please login to see nearby memes');
            return;
        }

        setLoading(true);
        setShowNearby(true);
        try {
            const response = await api.get('/memes/nearby?radius=10');
            setMemes(response.data.memes);
        } catch (error) {
            console.error('Error fetching nearby memes:', error);
            alert(error.response?.data?.error || 'Failed to fetch nearby memes');
            setShowNearby(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setShowNearby(false);
        fetchMemes();
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setShowNearby(false);
        fetchMemes();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        <i className="fas fa-search mr-3 text-blue-500"></i>
                        Search & Discover Memes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Find the perfect AI meme with our advanced search filters
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="card p-6 mb-8">
                    <form onSubmit={handleSearch} className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title or caption..."
                                className="input-field pl-14 text-lg"
                            />
                        </div>

                        {/* Filter Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">All Categories</option>
                                    <option value="AI">AI</option>
                                    <option value="Grok">Grok</option>
                                    <option value="xAI">xAI</option>
                                    <option value="Futuristic">Futuristic</option>
                                </select>
                            </div>

                            {/* Search Button */}
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="btn-primary w-full"
                                >
                                    <i className="fas fa-search mr-2"></i>
                                    Search
                                </button>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="btn-secondary w-full"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Clear Filters
                                </button>
                            </div>
                        </div>

                        {/* Nearby Memes Button */}
                        {isAuthenticated && (
                            <div className="pt-4 border-t dark:border-dark-700">
                                <button
                                    type="button"
                                    onClick={fetchNearbyMemes}
                                    className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all ${showNearby
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gradient-to-r from-green-400 to-blue-400 text-white hover:from-green-500 hover:to-blue-500'
                                        }`}
                                >
                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                    {showNearby ? 'Showing Nearby Memes (10km)' : 'Show Nearby Memes'}
                                </button>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Find memes from users near your location
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Results */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Search Results ({memes.length})
                        </h2>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <>
                            {/* Memes Grid */}
                            {memes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {memes.map((meme) => (
                                        <MemeCard key={meme.id} meme={meme} onUpdate={fetchMemes} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <i className="fas fa-search text-6xl text-gray-400 mb-4"></i>
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                        No memes found. Try different search terms or filters.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
