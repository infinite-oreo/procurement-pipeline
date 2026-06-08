/**
 * [INPUT]:  依赖 ./App 根组件，依赖 ./index.css 全局样式
 * [OUTPUT]: 无导出，直接挂载 React 树到 #root DOM 节点
 * [POS]:    前端应用 Bootstrap，Vite 构建入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
