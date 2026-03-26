#!/usr/bin/env node

import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

// 兼容 ESM 的 __dirname（关键！用于读取 template 模板）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 获取项目名
const argv = process.argv.slice(2)
let projectName = argv[0]

async function createCepProject() {
  // 交互询问
  if (!projectName) {
    const res = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '输入项目名称：',
        default: 'cep-plugin'
      }
    ])
    projectName = res.name
  }

  const targetPath = path.resolve(projectName)

  // 判断目录是否存在
  if (fs.existsSync(targetPath)) {
    console.error('❌ 目录已存在')
    process.exit(1)
  }

  // 复制模板（核心）
  const templatePath = path.join(__dirname, '../template')
  await fs.copy(templatePath, targetPath)

  console.log(`✅ 创建成功：${projectName}`)
  console.log(`👉 cd ${projectName} && pnpm install`)
}

createCepProject().catch(console.error)