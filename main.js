const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const { AES, enc } = require('crypto-js')
const app = express()

// 内存存储粘贴内容
const pastes = new Map()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// 中间件
app.use(bodyParser.json({ limit: '50mb' }))
app.use(express.static('public'))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
)
// 生成随机ID
function generateId() {
  return crypto.randomBytes(4).toString('hex')
}

// 提交新粘贴
app.post('/paste', (req, res) => {
  const content = req.body.t // decode(req.body)
  if (!content || typeof content !== 'string') {
    return res.status(400).send('Invalid content')
  }

  const id = generateId()
  pastes.set(id, {
    content: content,
    b: req.body.b,
    z: req.body.z,
    oc: req.body.oc,
    oct: req.body.oct,
    createdAt: new Date(),
  })

  res.send({ id })
})

// 获取粘贴内容
app.get('/:id', (req, res) => {
  const paste = pastes.get(req.params.id)
  if (!paste) {
    return res.json({ text: '404 - 数据不存在' })
  }
  if (paste.b) {
    pastes.delete(req.params.id)
  }

  res.json({
    text: encode(paste.content),
    b: paste.b,
    z: paste.z,
    oc: paste.oc,
    oct: paste.oct,
  })
})

// 启动服务器
const PORT = process.env.PORT || 9876
app.listen(PORT, () => {
  console.log(`Pastebin service running on http://localhost:${PORT}`)
})

function encode(s) {
  return s
  //   return AES.encrypt(s, '111sigewinne').toString()
}

function decode(s) {
  return s
  //   return AES.decrypt(s, '111sigewinne').toString(enc.Utf8)
}
