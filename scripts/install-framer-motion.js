import { execSync } from 'child_process'

console.log('[v0] Installing framer-motion...')
execSync('pnpm add framer-motion', { cwd: '/vercel/share/v0-project', stdio: 'inherit' })
console.log('[v0] Done.')
