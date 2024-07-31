'use client';
import { FC } from 'react';
import { Toaster } from 'react-hot-toast';
interface ToastProps {}

const Toast: FC<ToastProps> = ({}) => {
  return (
    <div>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
            zIndex: 99999,
          },
        }}
      />
    </div>
  );
};

export default Toast;
