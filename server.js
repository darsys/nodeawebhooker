'use strict';

require('dotenv').config();
const WEBHOOK_URL = process.env.WEBHOOK_URL

const express = require('express')
const { Webhook, MessageBuilder } = require('discord-webhook-node')
const { json } = require('body-parser')
const hook = new Webhook(WEBHOOK_URL)

// Constants
const PORT = 3000;
const HOST = '0.0.0.0'

// App
const app = express();
app.use(express.json())

app.post('/', (req, res) => {
	console.log(req.body)
	req.body.alerts.forEach(thisalert => {
		const myTitle = `**${thisalert.status}** ${thisalert.labels.severity} alert ${thisalert.labels.alertname}`
		const embed = new MessageBuilder()
		.setTimestamp(thisalert.startsAt)
		.setTitle(myTitle)
		// .addField('instance', thisalert.labels.instance, true)
		// .addField('job', thisalert.labels.job, true)
		if (thisalert.hasOwnProperty('labels')) {
				Object.keys(thisalert.labels).forEach (thiskey => {
				console.log(thiskey, thisalert.labels[thiskey])
				embed.addField(thiskey, thisalert.labels[thiskey], true)
			})
		}
		if (thisalert.hasOwnProperty('annotations')) {
			const myText = ''
			Object.keys(thisalert.annotations).forEach(thiskey => {
				console.log(thiskey, thisalert.annotations[thiskey])
				myText.concat(thiskey + ': ' + thisalert.labels[thiskey] +'\n')
			})
			console.log(myText)
			embed.setText(myText)
		}
		console.log(embed)
		sendToDiscord(embed, res)
	})
});

const sendToDiscord = async (theMessage, res) => {
	try {
		console.log('sending:', theMessage)
		await hook.send(theMessage)
		console.log('Successfully sent webhook!')
		res.status(200).end()
	}
	catch(e){
		console.log(e.message);
	};
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);