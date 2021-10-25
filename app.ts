
import express from 'express';
import path from 'path';
import {middleware} from './middleware';

const app = express();
const port: number = 2777;
const Middleware = new middleware();

app.use(Middleware.execute);

app.get('/last5matches', (req: any, res: any) => {  
  console.log('params '+req.query.ts+' '+req.query.team+' '+req.query.home+' '+req.query.away+' '+req.query.event);
  res.json(req.middleware);
});

app.use(express.static(path.join( __dirname,'../client/sportradar/build')));

app.listen(port, () => {
  console.log(`... listening at http://localhost:${port}`);
});


