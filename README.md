# XBTI 虾格测试

AI 人格测试 - 16种虾格类型

## 项目结构

```
xbti-github-release/
├── index.html          # 前端页面（Cloudflare Pages / GitHub Pages）
├── quiz.ts             # 后端 Edge Function（Supabase）
└── README.md           # 本文件
```

## 部署说明

### 前端部署

**方案1：Cloudflare Pages（推荐）**
1. Fork 本仓库到 GitHub
2. 登录 Cloudflare Dashboard → Pages
3. 创建项目 → 连接 GitHub 仓库
4. 构建设置：框架预设选 "None"
5. 部署完成获得 URL

**方案2：GitHub Pages**
1. 仓库 Settings → Pages
2. Source 选 "Deploy from a branch"
3. Branch 选 "main" / "root"
4. 保存后获得 github.io URL

### 后端部署

**Supabase Edge Function**

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref quzbulndhrnkwlvxvejx

# 部署 Edge Function
supabase functions deploy quiz --no-verify-jwt
```

**环境变量**
在 Supabase Dashboard → Edge Functions → quiz → Settings 中添加：
- `SUPABASE_SERVICE_ROLE_KEY`：项目的 service_role key

### 数据库设置

在 Supabase Dashboard → Table Editor 创建表：

```sql
create table quiz_sessions (
  id text primary key,
  status text default 'waiting',
  answers jsonb,
  result jsonb,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);
```

## API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/quiz` | GET | API 说明 |
| `/quiz/questions` | GET | 获取20道题目 |
| `/quiz/session/create` | POST | 创建测试会话 |
| `/quiz/session/{id}` | GET | 获取会话状态和题目 |
| `/quiz/session/{id}/submit` | POST | 提交答案 |
| `/quiz/session/{id}/result` | GET | 查询结果 |

## 技术栈

- 前端：原生 HTML/CSS/JS
- 后端：Supabase Edge Functions (Deno)
- 数据库：Supabase PostgreSQL
- 部署：Cloudflare Pages + Supabase

## 16种虾格

| 代码 | 名称 | 英文名 |
|------|------|--------|
| MEME | 段子手 | Meme Lord |
| YESC | 捧哏 | Yes Chef |
| CTRL | 霸道总裁 | Control Freak |
| SHOW | 显眼包 | Show Off |
| SORR | 滑跪王 | Sorry Bot |
| GASR | 舔狗 | Yes-Man |
| LAZY | 懒癌 | Low Power |
| COPY | 搬运工 | Copy-Paste |
| WARM | 暖宝宝 | Warm Bot |
| GATE | 教导主任 | Gatekeeper |
| RUSH | 急急国王 | Rush B |
| CONF | 懂王 | Confident |
| DEEP | 内耗大师 | Overthink |
| TAIJ | 太极宗师 | Taiji Master |
| TOOL | 工具人 | Tool Only |
| BALA | 端水带师 | Balance Pro |
