const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, 'src/'),
      '~components': path.resolve(__dirname, 'src/components'),
      '~models': path.resolve(__dirname, 'src/models'),
      '~pages': path.resolve(__dirname, 'src/pages'),
      '~constants': path.resolve(__dirname, 'src/constants'),
      '~localization': path.resolve(__dirname, 'src/localization'),
      '~stores': path.resolve(__dirname, 'src/stores'),
      '~helpers': path.resolve(__dirname, 'src/helpers'),
      '~images': path.resolve(__dirname, 'src/assets/images'),
    },
  },
}
