module.exports = {
  apps: [
    {
      name: "app",
      script: "dist/main.js",
      watch: false,
      cron_restart: "0 3 * * *",
      exec_mode: "cluster",
      instances: "2",
      ignore_watch: ["[/\\]./", "node_modules", ".pm2"],
      error_file: "./.pm2/logs/app-error.log",
      out_file: "./.pm2/logs/app-out.log",
      pid_file: "./.pm2/pids/app.pid",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      time: true,
      log_type: "text",
      merge_logs: true,
      env: {
        NODE_ENV: process.env.APP_ENV,
      },
    },
  ],
};