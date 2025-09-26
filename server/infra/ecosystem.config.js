module.exports = {
  apps: [
    {
      name: "app",
      script: "dist/main.js",
      exec_mode: "cluster",
      instances: "max",
      watch: false,
      cron_restart: "0 3 * * *",
      error_file: "./.pm2/logs/app-error.log",
      out_file: "./.pm2/logs/app-out.log",
      pid_file: "./.pm2/pids/app.pid",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      merge_logs: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
