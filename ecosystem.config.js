module.exports = {
  apps: [
    {
      name: 'hotel-backend',
      script: './backend/server.js',
      cwd: '/home/ubuntu/React-Sistema-de-Gerenciamento-Hotel',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/home/ubuntu/.pm2/logs/hotel-backend-error.log',
      out_file: '/home/ubuntu/.pm2/logs/hotel-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'hotel-frontend',
      script: 'serve',
      args: '-s build -l 3000',
      cwd: '/home/ubuntu/React-Sistema-de-Gerenciamento-Hotel/frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/ubuntu/.pm2/logs/hotel-frontend-error.log',
      out_file: '/home/ubuntu/.pm2/logs/hotel-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
