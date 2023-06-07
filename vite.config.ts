import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/

export default ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return defineConfig({
    resolve: {
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
    envPrefix: 'REACT_APP_',
    server: {
      port: process.env.REACT_APP_PORT || 3000,
    },
    preview: {
      port: 4000,
    },
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ],
    css: {
      devSourcemap: true,
    },
  })
}
