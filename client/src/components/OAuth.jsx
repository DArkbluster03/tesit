import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            } else {
                throw new Error(data.message || 'Failed to authenticate');
            }
        } catch (error) {
            setError(error.message);
            console.log(error);
        }
    };

    return (
        <>
            <button
                type="button"
                className="border border-purple-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 text-black hover:text-white font-semibold py-2 px-4 rounded flex items-center outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 ease-in-out"
                onClick={handleGoogleClick}
            >
                <AiFillGoogleCircle className="w-6 h-6 mr-2" />
                <span className="flex items-center">Continue with Google</span>
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
    );
}
