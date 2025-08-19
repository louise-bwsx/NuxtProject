module.exports = {
  apps: [{
    name: 'nuxt-app', // 這裡會顯示在pm2
    script: '.output/server/index.mjs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}