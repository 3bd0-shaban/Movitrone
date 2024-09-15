module.exports = {
  apps: [
    {
      name: 'movitrone-server',
      script: 'dist/src/index.js',
      cwd: '/var/www/movitrone-server', // directory where your application is located
      instances: 2, // run as many instances as there are CPU cores on 'max' , Here it's only two instance
      exec_mode: 'cluster', // enable clustering mode
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      watch: false, // disable watching for changes in production
      max_memory_restart: '1G', // restart if memory usage exceeds 1GB
      out_file: '/var/log/movitrone-server/out.log', // standard output log file
      error_file: '/var/log/movitrone-server/error.log', // error log file
      log_date_format: 'YYYY-MM-DD HH:mm Z', // log date format
      restart_delay: 5000, // wait 5 seconds before restarting on failure
      min_uptime: '60s', // consider app up if it has been up for at least 60 seconds
      max_restarts: 10, // try to restart up to 10 times
    },
  ],
};
