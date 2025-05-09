import { Avatar } from '@fluentui/react-components';
import React from 'react';

export interface UserAvatarProps {
	className?: string;
	imageUrl: string;
	userName: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ className, imageUrl, userName }) => {
	return (
		<Avatar
			className={className}
			name={userName}
			image={{ src: imageUrl }}
		/>
	);
};
