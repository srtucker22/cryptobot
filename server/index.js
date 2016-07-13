import express from 'express';
import http from 'http';
import morgan from 'morgan';
import socketIO from 'socket.io';
import routes from './routes/routes';

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const createStream = (query, callback) => {
  // eventually return a stream
  return callback(null, null);
};

io.on('connection', (socket) => {
  console.log('connection', Date.now());
  socket.emit('data', 'cheese');
  // createStream(query, (err, stream) => {
  //   if (!!err) {
  //     console.error(err);
  //     socket.emit('err', err);
  //   } else {
  //     stream.on('data', (data) => socket.emit('data', data));
  //     stream.on('end', () => socket.emit('end'));
  //     stream.on('error', (e) => socket.emit('err', e));
  //   }
  //
  //   socket.on('disconnect', () => !!stream && stream.destroy());
  // });
});

app.use((req, res, next)=> {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/files', routes.files);

server.listen(process.env.PORT, () => console.log('listening on ' + process.env.PORT));
