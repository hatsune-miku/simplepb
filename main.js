const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const app = express()

// 内存存储粘贴内容
const pastes = new Map()

// 中间件
app.use(bodyParser.text())
app.use(express.static('public'))

// 生成随机ID
function generateId() {
  return crypto.randomBytes(4).toString('hex')
}

// 提交新粘贴
app.post('/paste', (req, res) => {
  const content = req.body
  if (!content || typeof content !== 'string') {
    return res.status(400).send('Invalid content')
  }

  const id = generateId()
  pastes.set(id, {
    content: content,
    createdAt: new Date(),
  })

  res.send({ id })
})

// 获取粘贴内容
app.get('/:id', (req, res) => {
  const paste = pastes.get(req.params.id)
  if (!paste) {
    return res.status(404).send('Paste not found')
  }

  res.type('text').send(paste.content)
})

// 启动服务器
const PORT = process.env.PORT || 9876
app.listen(PORT, () => {
  console.log(`Pastebin service running on http://localhost:${PORT}`)
})
