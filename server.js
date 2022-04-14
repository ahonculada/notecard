require('dotenv').config()
const express = require('express')
const { 
	getStatuses,
	getTopics,
	getDifficulties,
	createCard,
} = require('./notion')

const app = express()
app.set("views", "./views")
app.set("view engine", "ejs")

let statuses = []
getStatuses().then(data => {
	statuses = data
})
let topics = []
getTopics().then(data => {
	topics = data
})
let difficulties = []
getDifficulties().then(data => {
	difficulties = data
})
setInterval(async () => {
	statuses = await getStatuses()
	topics = await getTopics()
	difficulties = await getDifficulties()
}, 1000 * 60 * 60)

app.get('/', (req, res) => {
	res.render("index", { statuses, topics, difficulties })
})

app.listen(process.env.PORT)
