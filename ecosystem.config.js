module.exports = {
  apps: [
    {
      name: 'crowdserve-frontend',
      script: './server.js',
      cwd: '/mnt/frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        name: 'crowdserve-frontend',
        NODE_ENV: 'development',
        NEXT_PUBLIC_API_SERVER: 'https://api-dev.ticket-crowdserve.com',
        PORT: 8080,
        HOST: '0.0.0.0'
      }
    },
  ],
};
