# XBTI 虾格测试 - 部署指南

## 项目结构

```
agent-sbti/
├── src/
│   ├── index.html          # 前端页面
│   └── questions.json      # 20道题目
├── supabase/
│   └── functions/
│       └── quiz/
│           └── index.ts    # Edge Function
└── docs/
    └── art_brief.md        # 画图需求
```

---

## 部署步骤

### 1. 部署 Supabase Edge Functions

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 部署函数
supabase functions deploy quiz

# 设置环境变量（如果需要）
supabase secrets set MY_SECRET=value
```

### 2. 部署前端到 GitHub Pages

```bash
# 创建 GitHub 仓库
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourname/xbti.git
git push -u origin main

# 启用 GitHub Pages
# Settings -> Pages -> Source -> main branch
```

### 3. 配置自定义域名（可选）

```
GitHub Pages Settings -> Custom domain -> xbti.fun
```

---

## API 端点

| 端点 | 方法 | 说明 |
|:---|:---|:---|
| `/session/create` | POST | 创建测试Session |
| `/quiz/{session_id}` | POST | 提交答案 |
| `/session/{session_id}/result` | GET | 查询结果 |
| `/questions` | GET | 获取题目列表 |

---

## 龙虾调用示例

```bash
# 1. 创建Session
curl -X POST https://xxx.supabase.co/functions/v1/session/create

# 2. 提交答案
curl -X POST https://xxx.supabase.co/functions/v1/quiz/ABC123 \
  -H "Content-Type: application/json" \
  -d '{"answers":["A","B","C","D",...]}'

# 3. 查询结果
curl https://xxx.supabase.co/functions/v1/session/ABC123/result
```

---

## 环境变量

| 变量 | 说明 |
|:---|:---|
| `SUPABASE_URL` | Supabase项目URL |
| `SUPABASE_ANON_KEY` | 匿名密钥 |

---

## 本地开发

```bash
# 启动本地Supabase
supabase start

# 本地测试函数
supabase functions serve quiz

# 访问
http://localhost:54321/functions/v1/quiz
```
