const fs = require('fs')
const path = require('path')

function replaceInDir(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath)
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      let changed = false

      if (content.includes('id: string')) {
        content = content.replace(/id: string/g, 'id: number')
        changed = true
      }
      if (content.includes('userId: string')) {
        content = content.replace(/userId: string/g, 'userId: number')
        changed = true
      }
      if (content.includes('deleteUser(id: string)')) {
        content = content.replace(/deleteUser\(id: string\)/g, 'deleteUser(id: number)')
        changed = true
      }
      
      // auth.ts createSession userId
      if (fullPath.includes('auth.ts') && content.includes('createSession(userId: number')) {
        // jose payload requires string for some things? No, we can put number in payload.
      }

      if (changed) {
        fs.writeFileSync(fullPath, content)
        console.log('Updated', fullPath)
      }
    }
  }
}

replaceInDir('src')
