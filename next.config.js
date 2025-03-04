/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  serverRuntimeConfig:{
    dbConfig:{
      host:process.env.HOST,
      port:process.env.DB_PORT,
      user:process.env.USER,
      password:process.env.PASSWORD,
      database:process.env.DB
  
    }
  }
};

module.exports = nextConfig;
