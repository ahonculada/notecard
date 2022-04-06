const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_API_KEY })

async function getStatus() {
	const database = await notion.databases.retrieve( { database_id: process.env.NOTION_DATABASE_ID } )
	return notionPropertiesById(database.properties)[process.env.NOTION_STATUS_ID].multi_select.options.map(option => {
		return { id: option.id, name: option.name }
	})
}

function notionPropertiesById(properties) {
	return Object.values(properties).reduce((obj, property) => {
		const { id, ...rest } = property	
		return { ...obj, [id]: rest }
	}, {})
	
}

function createCard({ title, status, difficulty, rating, URL, notes}) {
	notion.pages.create({
		parent: {
			database_id: process.env.NOTION_DATABASE_ID
		},
		properties: {
			[process.env.NOTION_TITLE_ID]: {
				title: [
					{
						type: "text",
						text: {
							content: title
						},
					},
				],
			},
			[process.env.NOTION_STATUS_ID]: {
				select: {
					name: status
				}
			},
			[process.env.NOTION_DIFFICULTY_ID]: {
				select: {
					name: difficulty 
				}
			},
			[process.env.NOTION_RATING_ID]: {
				number: rating
			},
			[process.env.NOTION_LINK_ID]: {
				rich_text: [
					{
						type: "text",
						text: {
							content: URL,
						},
					},
				],
			},
			[process.env.NOTION_NOTES_ID]: {
				rich_text: [
					{
						type: "text",
						text: {
							content: notes,
						},
					},
				],
			},
		},
	})
}

//getStatus().then(req => console.log(req))
createCard({ 
	title: "Leet Code Problem", 
	status: "Confident",
	difficulty: "Easy",
	rating: 5, 
	URL: "you_are_doing_great.com", 
	notes: "Keep up the good work.", 
})
