var socket = io('http://localhost:3900',{
	path:'/deneme',
	reconnectionDelayMax: 10000,
	auth: {
		token: "123"
	},
	query: {
		"my-key": "my-value"
	},
	withCredentials: true
		 // ,
	  // extraHeaders: {
	  //   "my-custom-header": "abcd"
	  // }
	});
	// var socket = io()
	socket.on('connect', () => {
	  // either with send()
	  console.log(`socket.on connect: calisti`)
	  socket.send(`merhaba ben client tarafindan alitek!`);

	  socket.emit('baglandi', global.sessionId);

	});

	// handle the event sent with socket.send()
	socket.on('message', data => {
		console.log('serverdan gelen mesaj:',data);
	});

	socket.on('sayac', (sayi) => {
		console.log('sayac calisti. Sayi:',sayi);
	});
	// handle the event sent with socket.emit()
	socket.on('selamlama', (elem1, elem2, elem3) => {
		console.log('selamlama',elem1, elem2, elem3);
	});