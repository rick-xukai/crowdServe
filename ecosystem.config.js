module.exports = {
  apps: [
    {
      name: 'crowdserve-frontend',
      script: './server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        name: 'dev-fe-crowdserve',
        NODE_ENV: 'development',
        PORT: 8080,
        https: 1,
        HOST: '0.0.0.0',
        ssl_key: './ssl/key',
        ssl_cert: './ssl/cert'
      },
      env_production: {
        name: 'prod-fe-crowdserve',
        NODE_ENV: 'production',
        PORT: 80,
        https: 1,
        HOST: '0.0.0.0',
        ssl_key: './ssl/key',
        ssl_cert: './ssl/cert'
      },
      env_test: {
        name: 'test-fe-crowdserve',
        NODE_ENV: 'test',
        PORT: 3000,
      },
    },
  ],
};
