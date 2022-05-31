require('dotenv').config()
const express = require('express')
const {
  getStatuses,
  getTopics,
  getDifficulties,
  createCard,
} = require('./notion')

const app = express()
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let statuses = []
getStatuses().then((data) => {
  statuses = data
})

let topics = []
getTopics().then((data) => {
  topics = data
})

let difficulties = []
getDifficulties().then((data) => {
  difficulties = data
})

setInterval(async () => {
  statuses = await getStatuses()
  topics = await getTopics()
  difficulties = await getDifficulties()
}, 1000 * 60 * 60)

app.get('/', (req, res) => {
  res.render('index', { statuses, topics, difficulties })
})

app.post('/create-card', async (req, res) => {
  const {
    title,
    statusIds,
    topicIds = [],
    difficultyIds,
    rating,
    link,
    notes,
  } = req.body

  await createCard({
    title: title,
    status: statusIds,
    topics: (Array.isArray(topicIds) ? topicIds : [topicIds]).map((topicId) => {
      return { id: topicId }
    }),
    difficulty: difficultyIds,
    rating: parseInt(rating),
    URL: link,
    notes: notes,
  })

  res.redirect('/')
})

app.listen(process.env.PORT)
