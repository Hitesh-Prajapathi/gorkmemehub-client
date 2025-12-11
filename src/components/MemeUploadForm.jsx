import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const MemeUploadForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        caption: '',
        category: 'AI',
        image_url: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { isAuthenticated } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
            setFormData({ ...formData, image_url: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        if (!formData.caption.trim()) {
            setError('Caption is required');
            return;
        }

        if (formData.caption.length > 140) {
            setError('Caption must be 140 characters or less');
            return;
        }

        if (!imageFile && !formData.image_url) {
            setError('Please upload an image or provide an image URL');
            return;
        }

        if (!isAuthenticated) {
            setError('Please login to upload memes');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title.trim());
            data.append('caption', formData.caption.trim());
            data.append('category', formData.category);

            if (imageFile) {
                data.append('image', imageFile);
            } else {
                data.append('image_url', formData.image_url);
            }

            await api.post('/memes', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFormData({ title: '', caption: '', category: 'AI', image_url: '' });
            setImageFile(null);
            setPreview(null);

            if (onSuccess) onSuccess();

            alert('Meme uploaded successfully! 🎉');
        } catch (error) {
            console.error('Upload error:', error);
            setError(error.response?.data?.error || 'Failed to upload meme');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i className="fas fa-plus-circle text-blue-500"></i>
                Create New Meme
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Give your meme a title..."
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Caption ({formData.caption.length}/140)
                    </label>
                    <textarea
                        name="caption"
                        value={formData.caption}
                        onChange={handleChange}
                        placeholder="Add a funny caption..."
                        rows="3"
                        maxLength="140"
                        className="input-field resize-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input-field"
                        required
                    >
                        <option value="AI">AI</option>
                        <option value="Grok">Grok</option>
                        <option value="xAI">xAI</option>
                        <option value="Futuristic">Futuristic</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="input-field"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">OR</p>
                    <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="Paste an image URL..."
                        className="input-field mt-2"
                        disabled={!!imageFile}
                    />

                    {preview && (
                        <div className="mt-4">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full max-h-64 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="spinner"></div>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-upload"></i>
                            Upload Meme
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default MemeUploadForm;
