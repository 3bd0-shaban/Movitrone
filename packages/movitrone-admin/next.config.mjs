/** @type {import('next').NextConfig} */
const nextConfig = {
      swcMinify: false,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000',
                pathname: '/**',
            }
        ]
    }
};

export default nextConfig;
