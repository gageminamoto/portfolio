import { execSync } from "child_process"

console.log("Installing framer-motion...")
execSync("pnpm add framer-motion", {
  cwd: "/vercel/share/v0-project",
  stdio: "inherit",
})
console.log("Done.")
