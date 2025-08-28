import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import crypto from 'crypto'

/**
 * Security headers middleware
 * Implements defense-in-depth security for development and production
 */
const securityHeaders = () => ({
  name: 'security-headers',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // Security headers for development
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('X-Frame-Options', 'DENY')
      res.setHeader('X-XSS-Protection', '1; mode=block')
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
      res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()')
      
      // HSTS for development (shorter duration)
      res.setHeader('Strict-Transport-Security', 'max-age=86400')
      
      // Feature-Policy (legacy, kept for compatibility)
      res.setHeader('Feature-Policy', "camera 'none'; microphone 'none'; geolocation 'none'")
      
      // Additional security headers
      res.setHeader('X-Permitted-Cross-Domain-Policies', 'none')
      res.setHeader('X-Download-Options', 'noopen')
      res.setHeader('X-DNS-Prefetch-Control', 'off')
      
      // Basic CSP for development (more permissive for HMR)
      res.setHeader(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          // allow Google auth scripts
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com",
          // firebase/identity endpoints used by Auth
          "connect-src 'self' ws: wss: http://localhost:* https://vitals.vercel-insights.com https://apis.google.com https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.googleapis.com https://*.firebaseio.com",
          // avatars & inline images if needed
          "img-src 'self' data: blob: https: https://*.googleusercontent.com",
          // dev styles often need 'unsafe-inline'
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "worker-src 'self' blob:",
          // google auth iframes/popups
          "frame-src 'self' https://accounts.google.com https://*.google.com https://*.firebaseapp.com",
          "object-src 'none'",
          "base-uri 'self'"
        ].join('; ')
      )
      
      // COOP header to allow popups for Google Auth
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
      
      next()
    })
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      // Generate nonce for this request
      const nonce = crypto.randomBytes(16).toString('base64')
      
      // Store nonce on response object for use in HTML
      res.locals = res.locals || {}
      res.locals.nonce = nonce
      
      // Stricter headers for preview/production builds
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('X-Frame-Options', 'DENY')
      res.setHeader('X-XSS-Protection', '1; mode=block')
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
      res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()')
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
      
      // Feature-Policy (legacy, kept for compatibility)
      res.setHeader('Feature-Policy', "camera 'none'; microphone 'none'; geolocation 'none'; payment 'none'")
      
      // Additional production security headers
      res.setHeader('X-Permitted-Cross-Domain-Policies', 'none')
      res.setHeader('X-Download-Options', 'noopen')
      res.setHeader('X-DNS-Prefetch-Control', 'off')
      res.setHeader('Expect-CT', 'max-age=86400, enforce')
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
      res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
      
      // Enhanced CSP for production with hash support for inline styles
      // Note: We keep 'unsafe-inline' for styles as a fallback for CSS-in-JS
      // In a fully production environment, you'd want to extract all inline styles
      res.setHeader(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          // allow Google auth scripts with nonce for production
          "script-src 'self' 'nonce-" + nonce + "' https://apis.google.com https://www.gstatic.com",
          // firebase/identity endpoints used by Auth
          "connect-src 'self' https://vitals.vercel-insights.com https://apis.google.com https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.googleapis.com https://*.firebaseio.com",
          // avatars & inline images
          "img-src 'self' data: https: blob: https://*.googleusercontent.com",
          // styles with fonts
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "worker-src 'self' blob:",
          "media-src 'self' blob:",
          // google auth iframes/popups
          "frame-src 'self' https://accounts.google.com https://*.google.com https://*.firebaseapp.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "block-all-mixed-content",
          "upgrade-insecure-requests"
        ].join('; ')
      )
      
      // COOP header to allow popups for Google Auth
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
      
      next()
    })
  }
})

// Dev-only test runner plugin
const testRunnerPlugin = () => ({
  name: 'test-runner',
  configureServer(server) {
    server.middlewares.use('/__dev/run-tests', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        return res.end('Method Not Allowed');
      }
      // dev-only guard
      if (process.env.NODE_ENV === 'production') {
        res.statusCode = 403;
        return res.end('Forbidden');
      }
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      // spawn playwright tests
      const { spawn } = await import('node:child_process');
      const child = spawn('npx', ['playwright', 'test', '--reporter=list'], {
        cwd: process.cwd(),
        shell: true
      });
      child.stdout.on('data', (d) => res.write(d));
      child.stderr.on('data', (d) => res.write(d));
      child.on('close', (code) => res.end(`\n\n[done] exit ${code}\n`));
    });
  }
})

export default defineConfig({
  plugins: [react(), tailwindcss(), securityHeaders(), testRunnerPlugin()],
  server: {
    port: 5173,
    open: true,
    // Additional security for dev server
    headers: {
      'X-Dev-Server': 'Vite'
    }
  },
  build: {
    // Security optimizations for production
    sourcemap: false, // Disable sourcemaps in production
    rollupOptions: {
      output: {
        // Ensure consistent chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    // Force include these dependencies
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
    // Exclude problematic sourcemaps
    esbuildOptions: {
      sourcemap: false
    }
  }
})