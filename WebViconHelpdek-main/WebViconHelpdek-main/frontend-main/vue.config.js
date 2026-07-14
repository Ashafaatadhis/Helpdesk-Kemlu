module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
    hot: true,
    liveReload: true,
  }
}