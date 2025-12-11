import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const MemeCard = ({ meme, onUpdate }) => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [reactions, setReactions] = useState({
        laugh: 0,
        robot: 0,
        think: 0
    });
    const [userReaction, setUserReaction] = useState(null);
    const [loading, setLoading] = useState(false);

    const imageUrl = meme.image_url?.startsWith('http')
        ? meme.image_url
        : `http://localhost:5000${meme.image_url}`;

    // Fetch reactions on mount
    useEffect(() => {
        fetchReactions();
    }, [meme.id]);

    const fetchReactions = async () => {
        try {
            const response = await api.get(`/memes/${meme.id}/reactions`);
            setReactions(response.data.counts);

            // Find user's reaction if authenticated
            if (isAuthenticated && user) {
                const userReactionData = response.data.reactions.find(
                    r => r.user_id === user.id
                );
                if (userReactionData) {
                    setUserReaction(userReactionData.reaction_type);
                }
            }
        } catch (error) {
            console.error('Error fetching reactions:', error);
        }
    };

    const handleReaction = async (reactionType) => {
        if (!isAuthenticated) {
            alert('Please login to react to memes!');
            return;
        }

        setLoading(true);
        try {
            await api.post(`/memes/${meme.id}/reactions`, {
                reaction_type: reactionType
            });

            setUserReaction(reactionType);
            await fetchReactions();

            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error adding reaction:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            AI: 'text-blue-500',
            Grok: 'text-purple-500',
            xAI: 'text-pink-500',
            Futuristic: 'text-green-500'
        };
        return colors[category] || 'text-gray-500';
    };

    return (
        <article className="meme-card">
            {/* Header - Instagram style */}
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-900">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <i className="fas fa-user text-white text-xs"></i>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {meme.uploader_username || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(meme.created_at).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
                <span className={`text-xs font-semibold ${getCategoryColor(meme.category)}`}>
                    #{meme.category}
                </span>
            </div>

            {/* Image */}
            <div className="relative bg-gray-100 dark:bg-gray-900" style={{ aspectRatio: '4/3' }}>
                <img
                    src={imageUrl}
                    alt={meme.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=450&fit=crop';
                    }}
                />
            </div>

            {/* Actions - Instagram style */}
            <div className="p-3 space-y-3">
                {/* Reaction Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleReaction('laugh')}
                        disabled={loading}
                        className={`reaction-btn ${userReaction === 'laugh' ? 'text-yellow-500' : 'text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        <i className="fas fa-laugh text-lg"></i>
                        <span className="text-sm font-medium">{reactions.laugh || 0}</span>
                    </button>

                    <button
                        onClick={() => handleReaction('robot')}
                        disabled={loading}
                        className={`reaction-btn ${userReaction === 'robot' ? 'text-blue-500' : 'text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        <i className="fas fa-robot text-lg"></i>
                        <span className="text-sm font-medium">{reactions.robot || 0}</span>
                    </button>

                    <button
                        onClick={() => handleReaction('think')}
                        disabled={loading}
                        className={`reaction-btn ${userReaction === 'think' ? 'text-purple-500' : 'text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        <i className="fas fa-brain text-lg"></i>
                        <span className="text-sm font-medium">{reactions.think || 0}</span>
                    </button>
                </div>

                {/* Total Reactions */}
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {meme.reaction_count || 0} reactions
                </p>

                {/* Caption */}
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {meme.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {meme.caption}
                    </p>
                </div>
            </div>
        </article>
    );
};

export default MemeCard;
