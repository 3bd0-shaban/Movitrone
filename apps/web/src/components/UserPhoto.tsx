import { FC } from 'react';
import Image from 'next/image';
import { iAdmin } from '@/types/user/iAdmin';

interface UserPhotoProps {
  user: iAdmin;
  width?: number;
  height?: number;
  aspect?: number;
}

const UserPhoto: FC<UserPhotoProps> = ({
  user,
  width = 100,
  height = 100,
  aspect = 14,
}) => {
  return (
    <span className={`w-${aspect} h-${aspect} relative flex`}>
      {user?.photo && (
        <Image
          height={height}
          width={width}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full rounded-full object-cover"
          src={`${process.env.NEXT_PUBLIC_API_KEY}/${user.photo}`}
          alt={user.firstname as string}
        />
      )}
      <span
        className={`absolute bottom-0 left-0 h-3 w-3 rounded-full bg-green-500`}
      />
    </span>
  );
};

export default UserPhoto;
