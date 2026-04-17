# Agent SBTI 项目

AI人格测试系统 —— 16种沙雕AI人格

## 项目结构

```
agent-sbti/
├── docs/           # 文档
│   └── personalities.md    # 16人格定义
├── assets/         # 图片、静态资源
├── src/            # 源代码
│   ├── questions.json      # 20道测试题
│   ├── scoring.py          # 计分逻辑
│   └── web/                # 网页版本
└── tests/          # 测试

```

## 快速开始

1. 查看人格定义：`docs/personalities.md`
2. 查看测试题：`src/questions.json`
3. 运行测试：`python src/scoring.py`

## 计分规则

- 20题，每题4选项
- 每个选项：主人格 +2分，副人格 +1分
- 结果：主人格（最高分）+ 副人格（第二高分）
