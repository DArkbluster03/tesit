import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Textarea } from 'flowbite-react';

const GradientButton = ({ type = 'button', children, onClick, disabled, outline }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`${
      outline
        ? 'border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-purple-500 hover:to-blue-500'
        : 'border-2 border-transparent bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500'
    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-4 py-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const UserInfo = ({ user, comment }) => (
  <div className='flex-shrink-0 mr-3'>
    <img
      className='w-10 h-10 rounded-full bg-gray-200'
      src={user.profilePicture}
      alt={user.username}
    />
    <div className='flex items-center mb-1'>
      <span className='font-bold mr-1 text-xs truncate'>
        {user ? `@${user.username}` : 'anonymous user'}
      </span>
      <span className='text-gray-500 text-xs'>
        {moment(comment.createdAt).fromNow()}
      </span>
    </div>
  </div>
);

const CommentActions = ({ canEditOrDelete, onLike, onEdit, onDelete, comment, currentUser }) => (
  <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
    <button
      type='button'
      onClick={() => onLike(comment._id)}
      aria-label='Like this comment'
      className={`text-gray-400 hover:text-blue-500 ${
        currentUser &&
        comment.likes.includes(currentUser._id) &&
        '!text-blue-500'
      }`}
    >
      <FaThumbsUp className='text-sm' />
    </button>
    <p className='text-gray-400'>
      {comment.numberOfLikes > 0 &&
        comment.numberOfLikes +
          ' ' +
          (comment.numberOfLikes === 1 ? 'like' : 'likes')}
    </p>
    {canEditOrDelete && (
      <>
        <button
          type='button'
          onClick={onEdit}
          className='text-gray-400 hover:text-blue-500'
        >
          Edit
        </button>
        <button
          type='button'
          onClick={() => onDelete(comment._id)}
          className='text-gray-400 hover:text-red-500'
        >
          Delete
        </button>
      </>
    )}
  </div>
);

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api-alpha-fawn.vercel.app/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Error fetching user:', error.message);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    const previousContent = comment.content;
    try {
      onEdit(comment, editedContent); // Optimistic update
      const res = await fetch(`https://api-alpha-fawn.vercel.app/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to save the comment');
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving comment:', error.message);
      onEdit(comment, previousContent); // Revert if failed
    }
  };

  const canEditOrDelete = currentUser && (currentUser._id === comment.userId || currentUser.isAdmin);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <UserInfo user={user} comment={comment} />
      <div className='flex-1'>
        {isEditing ? (
          <>
            <Textarea
              className='mb-2'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
              <GradientButton
                type='button'
                onClick={handleSave}
              >
                Save
              </GradientButton>
              <GradientButton
                type='button'
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </GradientButton>
            </div>
          </>
        ) : (
          <>
            <p className='text-gray-500 pb-2'>{comment.content}</p>
            <CommentActions
              canEditOrDelete={canEditOrDelete}
              onLike={onLike}
              onEdit={handleEdit}
              onDelete={onDelete}
              comment={comment}
              currentUser={currentUser}
            />
          </>
        )}
      </div>
    </div>
  );
}
