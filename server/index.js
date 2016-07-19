import express from 'express';
import http from 'http';
import morgan from 'morgan';
import socketIO from 'socket.io';
import routes from './routes/routes';
import * as utils from './utils/utils';
import solver from './utils/simulated-annealing';

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const createStream = (query, callback) => {
  // eventually return a stream
  return callback(null, null);
};

io.on('connection', (socket) => {
  console.log('CONNECTION', Date.now());
  socket.on('decrypt', (cryptogram)=> {
    solver.simulatedAnnealing(cryptogram, socket);
  });
});

app.use((req, res, next)=> {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/files', routes.files);

server.listen(process.env.PORT, () =>
  console.log('listening on ' + process.env.PORT));
