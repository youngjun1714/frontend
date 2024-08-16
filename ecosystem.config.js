module.exports = {
  apps: [
    {
      name: 'artiside',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        PORT: '3002',
      },
    },
  ],
};
