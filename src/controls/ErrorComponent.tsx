import React from 'react';

interface ErrorComponentProps {
	message: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message }) => {
	return (
		<div className='flex flex-col items-center justify-center min-h-[200px] w-full bg-red-100 text-red-800 p-4 rounded-xl shadow-md text-center'>
			<h2 className='text-2xl font-semibold mb-2'>¡An error happened!</h2>
			<p className='text-base sm:text-lg'>{message}. Please contact the SysAdmin or the App Developer</p>
		</div>
	);
};

export default ErrorComponent;
