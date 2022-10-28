module.exports = {
  apps: [
    {
      name: 'crowdserve-frontend',
      script: './server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        name: 'crowdserve-frontend-dev',
        NODE_ENV: 'development',
        PORT: 8080,
        https: 1,
        HOST: '0.0.0.0',
        ssl_key: './ssl/key',
        ssl_cert: './ssl/cert'
      },
      env_production: {
        name: 'crowdserve-frontend-prod',
        NODE_ENV: 'production',
        PORT: 80,
        https: 1,
        HOST: '0.0.0.0',
        ssl_key: './ssl/key',
        ssl_cert: './ssl/cert'
      },
      env_test: {
        name: 'crowdserve-frontend-test',
        NODE_ENV: 'test',
        PORT: 3000,
      },
    },
  ],
};
