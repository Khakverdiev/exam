import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link  } from 'react-router-dom';

const ConfirmEmail = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [confirmEmailSuccess, setConfirmEmailSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await axios.post(
                    'https://localhost:7131/api/account/ConfirmEmail',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                
                setMessage('Your email has been confirmed! You can now log in.');
                setError('');
                setConfirmEmailSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (err) {
                console.error('Error confirming email:', err);
                setError('An error occurred while confirming your email. Please try again later.');
                setMessage('');
            }
        };

        confirmEmail();
    }, [token, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
                <h1 className="text-3xl font-bold mb-6 text-center">Confirm Email</h1>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
                <p className="text-gray-600 text-sm text-center">Please wait while we confirm your email.</p>

                <div className="flex justify-center mt-4">
                    <Link
                        to="/login"
                        className={`${
                            confirmEmailSuccess
                                ? 'text-gray-500 cursor-not-allowed'
                                : 'text-blue-500 hover:underline'
                        } text-sm`}
                        onClick={(e) => confirmEmailSuccess && e.preventDefault()}
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ConfirmEmail;