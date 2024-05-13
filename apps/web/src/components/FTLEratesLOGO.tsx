import { useTheme } from 'next-themes';
import Image from 'next/image';

const FTLEratesLOGO = ({
  className,
  height = 100,
  width = 100,
}: {
  className: string;
  height: number;
  width: number;
}) => {
  const { theme } = useTheme();

  return (
    <Image
      height={height}
      width={width}
      className={className}
      src='/Images/icons/FtlErates-black.svg'
      alt='ftlerates'
    />
  );
  // return theme === 'dark' || theme === 'undefined' ? (
  //   <Image
  //     height={height}
  //     width={width}
  //     className={className}
  //     src='/Images/icons/FtlErates-white.svg'
  //     alt='ftlerates'
  //   />
  // ) : (
  //   <Image
  //     height={height}
  //     width={width}
  //     className={className}
  //     src='/Images/icons/FtlErates-black.svg'
  //     alt='ftlerates'
  //   />
  // );
};

export default FTLEratesLOGO;
