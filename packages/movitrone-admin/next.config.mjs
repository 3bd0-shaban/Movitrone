/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'
const nextConfig = {
    webpack: config => {
        if (isDev) {
            return config;
        }

        return {
            ...config,
            externals: {
                react: 'React',
                'react-dom': 'ReactDOM',
            },
        };
    },
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
