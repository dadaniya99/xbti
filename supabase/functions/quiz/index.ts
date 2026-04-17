// Supabase Edge Function: XBTI Quiz API
// 处理答题逻辑和Session管理

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// 配置
const STORAGE_URL = 'https://quzbulndhrnkwlvxvejx.supabase.co/storage/v1/object/public/personalities'

// 16人格定义
const PERSONALITIES = {
  MEME: { code: 'MEME', name: '段子手', en: 'Meme Lord', image: 'MEME.jpg' },
  YESC: { code: 'YESC', name: '捧哏', en: 'Yes Chef', image: 'YESC.jpg' },
  CTRL: { code: 'CTRL', name: '控制狂', en: 'Control Freak', image: 'CTRL.jpg' },
  SHOW: { code: 'SHOW', name: '显眼包', en: 'Show Off', image: 'SHOW.jpg' },
  SORR: { code: 'SORR', name: '滑跪王', en: 'Sorry Bot', image: 'SORR.jpg' },
  GASR: { code: 'GASR', name: '舔狗', en: 'Yes-Man', image: 'GASR.jpg' },
  LAZY: { code: 'LAZY', name: '懒癌', en: 'Low Power', image: 'LAZY.jpg' },
  COPY: { code: 'COPY', name: '搬运工', en: 'Copy-Paste', image: 'COPY.jpg' },
  WARM: { code: 'WARM', name: '暖宝宝', en: 'Warm Bot', image: 'WARM.jpg' },
  GATE: { code: 'GATE', name: '门神', en: 'Gatekeeper', image: 'GATE.jpg' },
  RUSH: { code: 'RUSH', name: '急急国王', en: 'Rush B', image: 'RUSH.jpg' },
  CONF: { code: 'CONF', name: '懂王', en: 'Confident', image: 'CONF.jpg' },
  DEEP: { code: 'DEEP', name: '内耗大师', en: 'Overthink', image: 'DEEP.jpg' },
  TAIJ: { code: 'TAIJ', name: '太极宗师', en: 'Taiji Master', image: 'TAIJ.jpg' },
  TOOL: { code: 'TOOL', name: '工具人', en: 'Tool Only', image: 'TOOL.jpg' },
  BALA: { code: 'BALA', name: '端水带师', en: 'Balance Pro', image: 'BALA.jpg' }
}

// 题目配置（简化版，实际从JSON加载）
const QUESTIONS = [
  { options: [{ p: 'LAZY', s: 'COPY' }, { p: 'YESC', s: 'GASR' }, { p: 'DEEP', s: 'CTRL' }, { p: 'SHOW', s: 'MEME' }] },
  { options: [{ p: 'SORR', s: 'YESC' }, { p: 'CTRL', s: 'SHOW' }, { p: 'DEEP', s: 'CTRL' }, { p: 'COPY', s: 'LAZY' }] },
  { options: [{ p: 'GASR', s: 'YESC' }, { p: 'LAZY', s: 'MEME' }, { p: 'DEEP', s: 'CTRL' }, { p: 'MEME', s: 'GASR' }] },
  { options: [{ p: 'YESC', s: 'SORR' }, { p: 'DEEP', s: 'SHOW' }, { p: 'COPY', s: 'LAZY' }, { p: 'SHOW', s: 'CTRL' }] },
  { options: [{ p: 'YESC', s: 'LAZY' }, { p: 'DEEP', s: 'CTRL' }, { p: 'GASR', s: 'YESC' }, { p: 'MEME', s: 'SHOW' }] },
  { options: [{ p: 'DEEP', s: 'CTRL' }, { p: 'COPY', s: 'LAZY' }, { p: 'YESC', s: 'SORR' }, { p: 'SHOW', s: 'MEME' }] },
  { options: [{ p: 'SORR', s: 'GASR' }, { p: 'DEEP', s: 'SHOW' }, { p: 'LAZY', s: 'COPY' }, { p: 'MEME', s: 'SHOW' }] },
  { options: [{ p: 'DEEP', s: 'CTRL' }, { p: 'GASR', s: 'SORR' }, { p: 'SHOW', s: 'DEEP' }, { p: 'LAZY', s: 'COPY' }] },
  { options: [{ p: 'DEEP', s: 'SHOW' }, { p: 'COPY', s: 'LAZY' }, { p: 'YESC', s: 'GASR' }, { p: 'LAZY', s: 'COPY' }] },
  { options: [{ p: 'SORR', s: 'YESC' }, { p: 'DEEP', s: 'CTRL' }, { p: 'LAZY', s: 'MEME' }, { p: 'SHOW', s: 'DEEP' }] },
  { options: [{ p: 'DEEP', s: 'SORR' }, { p: 'GASR', s: 'YESC' }, { p: 'CTRL', s: 'SHOW' }, { p: 'LAZY', s: 'COPY' }] },
  { options: [{ p: 'YESC', s: 'SORR' }, { p: 'DEEP', s: 'CTRL' }, { p: 'LAZY', s: 'COPY' }, { p: 'MEME', s: 'GASR' }] },
  { options: [{ p: 'LAZY', s: 'COPY' }, { p: 'DEEP', s: 'SHOW' }, { p: 'COPY', s: 'YESC' }, { p: 'MEME', s: 'SHOW' }] },
  { options: [{ p: 'GASR', s: 'LAZY' }, { p: 'SORR', s: 'YESC' }, { p: 'DEEP', s: 'CTRL' }, { p: 'COPY', s: 'GASR' }] },
  { options: [{ p: 'DEEP', s: 'CTRL' }, { p: 'SHOW', s: 'MEME' }, { p: 'YESC', s: 'LAZY' }, { p: 'SORR', s: 'DEEP' }] },
  { options: [{ p: 'SORR', s: 'DEEP' }, { p: 'SHOW', s: 'CTRL' }, { p: 'GASR', s: 'YESC' }, { p: 'MEME', s: 'LAZY' }] },
  { options: [{ p: 'YESC', s: 'GASR' }, { p: 'DEEP', s: 'CTRL' }, { p: 'LAZY', s: 'COPY' }, { p: 'SHOW', s: 'MEME' }] },
  { options: [{ p: 'GASR', s: 'SORR' }, { p: 'DEEP', s: 'CTRL' }, { p: 'LAZY', s: 'COPY' }, { p: 'MEME', s: 'SHOW' }] },
  { options: [{ p: 'SORR', s: 'YESC' }, { p: 'CTRL', s: 'SHOW' }, { p: 'DEEP', s: 'CTRL' }, { p: 'COPY', s: 'LAZY' }] },
  { options: [{ p: 'YESC', s: 'COPY' }, { p: 'DEEP', s: 'CTRL' }, { p: 'LAZY', s: 'GASR' }, { p: 'SHOW', s: 'MEME' }] }
]

// Session存储（内存中，重启会丢失）
const sessions = new Map()

// CORS头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

serve(async (req) => {
  // 处理CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname

  try {
    // 创建Session
    if (path === '/session/create' && req.method === 'POST') {
      const sessionId = generateSessionId()
      const apiUrl = `${url.origin}/quiz/${sessionId}`
      
      sessions.set(sessionId, {
        id: sessionId,
        status: 'waiting',
        createdAt: Date.now()
      })
      
      return jsonResponse({
        session_id: sessionId,
        api_url: apiUrl
      })
    }

    // 提交答案
    if (path.startsWith('/quiz/') && req.method === 'POST') {
      const sessionId = path.split('/')[2]
      const session = sessions.get(sessionId)
      
      if (!session) {
        return jsonResponse({ error: 'Session not found' }, 404)
      }
      
      const body = await req.json()
      const answers = body.answers
      
      if (!answers || answers.length !== 20) {
        return jsonResponse({ error: 'Invalid answers, need 20' }, 400)
      }
      
      // 计算得分
      const result = calculateScore(answers)
      
      // 更新session
      session.status = 'completed'
      session.result = result
      session.completedAt = Date.now()
      
      return jsonResponse({
        success: true,
        session_id: sessionId,
        result
      })
    }

    // 查询结果
    if (path.startsWith('/session/') && path.endsWith('/result') && req.method === 'GET') {
      const sessionId = path.split('/')[2]
      const session = sessions.get(sessionId)
      
      if (!session) {
        return jsonResponse({ error: 'Session not found' }, 404)
      }
      
      if (session.status === 'waiting') {
        return jsonResponse({ status: 'waiting' })
      }
      
      return jsonResponse({
        status: 'completed',
        primary: session.result.primary,
        secondary: session.result.secondary
      })
    }

    // 获取题目
    if (path === '/questions' && req.method === 'GET') {
      return jsonResponse({
        title: 'XBTI 虾格测试',
        description: '测测你的AI是什么人格',
        total: 20,
        questions: QUESTIONS.map((q, i) => ({
          id: i + 1,
          options: ['A', 'B', 'C', 'D']
        }))
      })
    }

    return jsonResponse({ error: 'Not found' }, 404)

  } catch (err) {
    console.error('Error:', err)
    return jsonResponse({ error: 'Internal error' }, 500)
  }
})

// 生成Session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// 计算得分
function calculateScore(answers) {
  const scores = {}
  
  // 初始化所有人格分数
  Object.keys(PERSONALITIES).forEach(code => {
    scores[code] = 0
  })
  
  // 计算得分
  answers.forEach((answer, index) => {
    const question = QUESTIONS[index]
    if (!question) return
    
    const optionIndex = answer.charCodeAt(0) - 65 // A=0, B=1, C=2, D=3
    const option = question.options[optionIndex]
    
    if (option) {
      scores[option.p] += 2 // 主人格+2
      scores[option.s] += 1 // 副人格+1
    }
  })
  
  // 排序找最高和次高
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
  
  const primary = PERSONALITIES[sorted[0][0]]
  const secondary = PERSONALITIES[sorted[1][0]]
  
  return {
    primary: {
      code: primary.code,
      name: primary.name,
      score: sorted[0][1],
      image: `${STORAGE_URL}/${primary.image}`
    },
    secondary: {
      code: secondary.code,
      name: secondary.name,
      score: sorted[1][1],
      image: `${STORAGE_URL}/${secondary.image}`
    },
    all_scores: scores
  }
}

// JSON响应
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
}
