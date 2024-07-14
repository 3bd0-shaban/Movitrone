'use client';

import Image from 'next/image';

import FormSignIn from './FormSignIn';

export default function SignIn() {
  return (
    <div className="relative flex h-screen items-center justify-start p-5 duration-300">
      <div className="container relative max-w-md rounded-xl p-5 shadow  backdrop-blur-md shadow-blue-800 duration-300 md:p-10">
        <div className="contianerAfter containerBefore z-20 h-full w-full duration-300">
          <div className="flex w-full items-center justify-center">
            <Image
              height={100}
              width={100}
              className="h-10 w-36"
              src={'/Images/icons/FtlErates-Black.svg'}
              priority={true}
              alt=""
            />
          </div>
          <div className="my-4 space-y-3">
            <p className="text-3xl font-bold text-white">Movitrone</p>
            <p className="w-3/4 font-medium text-white">
              Dashboard admin panal
            </p>
          </div>
          <FormSignIn />
        </div>
      </div>
    </div>
  );
}
