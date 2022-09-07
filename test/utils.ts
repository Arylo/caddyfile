import fs from 'fs'
import path from 'path'

export const getTestCaddyfile = (filename: string) => {
    const contentPath = path.resolve(__dirname, 'public', filename)
    return fs.readFileSync(contentPath, 'utf-8')
}

export default { getTestCaddyfile }