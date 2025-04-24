import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  assetsInclude: ['**/*.html'],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'src'),
      '@views':path.resolve(__dirname,'src/views'),
      '@utils':path.resolve(__dirname,'src/utils'),
      '@api':path.resolve(__dirname,'src/api'),
      '@assets':path.resolve(__dirname,'src/assets'),
    }
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://121.43.235.183:8080/',
        //target:'http://localhost:8080/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
