import express from 'express';
import path from 'path';
//import webpacDevMiddleware from 'webpack-dev-middleware';
import middleware from './middleware';
//import pgp from 'pg-promise';
import websocket from 'ws';
var pgp = require('pg-promise')();
let pg = require('pg');
import bodyParser from 'body-parser';

const app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

let webSocket;
var db = pgp('postgres://darshan:block8@localhost:5432/testdb');

const socket = new websocket.Server({ port: 8081 });

socket.broadcast = function broadcast(data) {
  socket.clients.forEach(function each(client) {
    console.log('IT IS GETTING INSIDE CLIENTS');
    //console.log(client);
    console.log(data);
    client.send(data);
  });
};

socket.on('connection', function connection(ws) { //ws is listening to connection
	webSocket = ws;
		ws.on('message', function incoming(message) {// triggers when client send message
			console.log('received: %s', message);
      socket.broadcast(message);
			ws.send('Received message: '+ message);
		});
		ws.send('Connection to websocket created successfully');
});

let client = new pg.Client('postgres://darshan:block8@localhost:5432/testdb');
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
    client.connect();
    client.query('LISTEN "event"');
    client.on('notification', function(data) {
        console.log(data.payload);
				//webSocket.send(data.payload);
        socket.broadcast(data.payload);
    });
});

app.post("/deleteRow", async (req, res) => {
  try {
		const user_name = req.body.name;
		const user_age = req.body.age;
		console.log(`DELETE FROM test WHERE name='${user_name}' AND age=${user_age}`);
		const result = await db.any(`DELETE FROM test WHERE name='${user_name}' AND age=${user_age}`);
		console.log(result);
		return res.send('Row deleted successfully');
	}
	catch(e) {
		console.log('Error: '+e);
		return false;
	}
});

app.use("/getNameUsingSocket", async (req, res) =>{
	try {
	    const name = await db.any('SELECT * FROM test WHERE age = $1', 21);
	    console.log(name);
			//webSocket.send(name[0].name);
      socket.broadcast(name[0].name);
			res.send(name);
			return name;
	}
	catch(e) {
		 console.log('Error: '+e);
	}

});

app.use("/getName", async (req, res) =>{
	try {
	    const name = await db.any('SELECT * FROM test WHERE age = $1', 21);
	    console.log(name);
			return res.send(name);
	}
	catch(e) {
		 console.log('Error: '+e);
	}

});

app.use("/getTeamData", async (req, res) =>{
	try {
	    const name = await db.any('SELECT * FROM test');
	    console.log(name);
			return res.send(name);
	}
	catch(e) {
		 console.log('Error: '+e);
	}

});

app.post('/insertData', async (req, res) => {
	try {

		const user_name = req.body.name;
		const user_age = req.body.age;
		console.log(`INSERT INTO test (name, age) VALUES ('${user_name}', ${user_age})`);
		const result = await db.any(`INSERT INTO test (name, age) VALUES ('${user_name}', ${user_age})`);
		console.log(result);
		return res.send('Data added successfully');
	}
	catch(e) {
		console.log('Error: '+e);
		return false;
	}
});

app.use("/helloworld", function(req, res){
	res.send("Hello World!!");
});

middleware(app, {
	outputPath: path.resolve(process.cwd(), 'dist'),
	publicPath: '/'
});


app.listen(3000, ()=>{
	console.log('application recieving request on port 3000');
});
