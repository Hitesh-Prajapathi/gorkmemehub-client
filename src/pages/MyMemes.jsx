import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MemeCard from '../components/MemeCard';
import api from '../services/api';

const MyMemes = () => {
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMeme, setEditingMeme] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', caption: '', category: '' });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchMyMemes();
    }, []);

    const fetchMyMemes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/memes/my-memes');
            setMemes(response.data.memes);
        } catch (error) {
            console.error('Error fetching my memes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (meme) => {
        setEditingMeme(meme.id);
        setEditForm({
            title: meme.title,
            caption: meme.caption,
            category: meme.category
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/memes/${editingMeme}`, editForm);
            setEditingMeme(null);
            fetchMyMemes();
            alert('Meme updated successfully!');
        } catch (error) {
            console.error('Error updating meme:', error);
            alert(error.response?.data?.error || 'Failed to update meme');
        }
    };

    const handleDelete = async (memeId) => {
        if (!window.confirm('Are you sure you want to delete this meme?')) {
            return;
        }

        try {
            await api.delete(`/memes/${memeId}`);
            fetchMyMemes();
            alert('Meme deleted successfully!');
        } catch (error) {
            console.error('Error deleting meme:', error);
            alert(error.response?.data?.error || 'Failed to delete meme');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        <i className="fas fa-images mr-3 text-purple-500"></i>
                        My Memes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Welcome back, <span className="font-semibold text-purple-500">{user?.username}</span>! Here are all your uploaded memes.
                    </p>
                </div>

                {/* Edit Modal */}
                {editingMeme && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    <i className="fas fa-edit mr-2 text-blue-500"></i>
                                    Edit Meme
                                </h2>
                                <button
                                    onClick={() => setEditingMeme(null)}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <i className="fas fa-times text-2xl"></i>
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                        Caption ({editForm.caption.length}/140)
                                    </label>
                                    <textarea
                                        value={editForm.caption}
                                        onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                                        className="input-field resize-none"
                                        rows="3"
                                        maxLength="140"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        className="input-field"
                                        required
                                    >
                                        <option value="AI">AI</option>
                                        <option value="Grok">Grok</option>
                                        <option value="xAI">xAI</option>
                                        <option value="Futuristic">Futuristic</option>
                                    </select>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button type="submit" className="btn-primary flex-1">
                                        <i className="fas fa-save mr-2"></i>
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingMeme(null)}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        {/* Memes Grid with Edit/Delete */}
                        {memes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {memes.map((meme) => (
                                    <div key={meme.id} className="relative group">
                                        <MemeCard meme={meme} onUpdate={fetchMyMemes} />

                                        {/* Edit/Delete Buttons Overlay */}
                                        <div className="absolute top-3 left-3 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(meme)}
                                                className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 shadow-lg transform hover:scale-110 transition-all"
                                                title="Edit"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(meme.id)}
                                                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all"
                                                title="Delete"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <i className="fas fa-image text-6xl text-gray-400 mb-4"></i>
                                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                                    You haven't uploaded any memes yet.
                                </p>
                                <a href="/" className="btn-primary inline-block">
                                    <i className="fas fa-plus-circle mr-2"></i>
                                    Upload Your First Meme
                                </a>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyMemes;
