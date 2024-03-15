const someFunction = (l) => {
const express = require('express')
const clients = new Map();
const webserver = express()

webserver.set('view engine', 'ejs');
 webserver.use((req, res) =>
   res.sendFile('/views/1.ejs', { root: __dirname })
 )
 .listen(3000, () => console.log(`Listening on 3000`))
const { WebSocketServer } = require('ws')
const sockserver = new WebSocketServer({ port: 44 })
sockserver.on('connection', (ws,req) => {
  const queryString = req.url.split('?'); // Extract the query string from the URL
console.log(queryString[1])

ws.id=queryString[1];
sockserver.clients.forEach(client => {
  var json_user={
    header:"user",
    username:`${queryString[1]}`
  };
  client.send(JSON.stringify(json_user));
})


clients.set(ws.id, ws);
 console.log(ws.id+'connected!')
 ws.send('connection established')
 ws.on('close', () => console.log('Client has disconnected!'))
 ws.on('message', data => {
       disp(data);
       var g=`${data}`;
       console.log(g.split('&'));

        sockserver.clients.forEach(client => {
        if((client.id===g.split('&')[1])||(client.id===g.split('&')[2]))
         {
          if(("admin2024-03-13"===g.split('&')[1])||("admin2024-03-13"===g.split('&')[2]))
          {
            var json_data={
              header:"message",
              from: g.split('&')[1],
              to: g.split('&')[2],
              content: g.split('&')[0]
            };
            client.send(JSON.stringify(json_data));
          }
         }
    
        })
 })
 ws.onerror = function () {
   console.log('websocket error')
 }
})
};


var messages=[];
function disp(a)
{
  
  var a1=`${a}`;
  messages[messages.length]=a1;
  console.log('distributing message: '+messages[messages.length-1]);
}

function load()
{



}
module.exports = {
  someFunction,
};
