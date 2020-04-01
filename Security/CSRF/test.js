const request = require('request')

request.post('http://localhost:3001/api/transfer2', {
	headers: {
		Referer: 'http://localhost:3001',
		cookie: 'connect.sid=1585661046739.6685'
	},
	form: {
		payee: 'yvette',
		amount: 9999
	}
}, (a, b, c) => {
	console.log(c)
})
