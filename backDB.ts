import { ObjectId } from "mongodb";

const path = require('path');
// const indexHTML = path.resolve(__dirname, './index.html');
const express = require('express');
const app = express();
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
const cookieParser = require('cookie-parser');


app.use(cookieParser());
// app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const opt = {
  origin: 'http://localhost:8080',
  credentials: true,
}
app.use(cors(opt));

const port = 3012;
let db: any;


// TS
interface TodoItem {
  id: string,
  text: string,
  checked: boolean
}

let items: TodoItem[] = [];

app.get('/api/v1/items', async (req: any, res: { send: (arg0: string) => void; }) => {
  // if (await db.collection('users').findOne({'sessionId': +req.headers.cookie})) {
  //   // res.send(JSON.stringify({"ok": true}));
  // } else {
  //   res.send(JSON.stringify({'error': 'forbidden'}));
  //   return;
  // }

  let response;
  try {
    items = [];
    await db.collection('artists').find().forEach((item: any) => {
      items.push({id: item._id.toString(), text: item.text, checked: item.checked});
    });
    response = {items: items};
  } catch (e) {
    throw e;
  }
  res.send(JSON.stringify(response));
})

app.post('/api/v1/logout', async (req: any, res: any) => {
  await db.collection('users').updateOne({'sessionId': +req.headers.cookie},
    {
      $set: {
        'sessionId': 0
      }
    })
  res.end(JSON.stringify({"ok": true}));
})

app.post('/api/v1/register', async (req: any, res: any) => {
  try {
    let sessionId = Math.random();
    let user = await db.collection('users').findOne({'login': req.body.login})
    if (user) {
      res.end(JSON.stringify({"ok": true}));
      return;
    }
    await db.collection('users').insertOne({'login': req.body.login, 'pass': req.body.pass, 'sessionId': sessionId});
    await res.writeHead(200, {
      "Set-Cookie": sessionId
    });
    res.end(JSON.stringify({"ok": true}));
  } catch (e) {
    throw e;
  }
})

app.post('/api/v1/login', async (req: any, res: any) => {
  let item = await db.collection('users').findOne({'login': req.body.login});
  if (!item) {
    res.send({"error": 'not found'});
  } else {
    if (!req.headers.cookie) {
      if (item.pass === req.body.pass) {
        await res.writeHead(200, {
          "Set-Cookie": item.sessionId
        });
        res.end(JSON.stringify({"ok": true}));
      } else {
        res.send({"error": 'not found'});
      }
    } else {
      if (item.pass === req.body.pass) {
        await db.collection('users').updateOne({'login': req.body.login},
          {
            $set: {
              'sessionId': +req.headers.cookie
            }
          })
        res.send({"ok": true});
      } else {
        res.send({"error": 'not found'});
      }
    }
  }
})


app.post('/api/v1/items', (req: any, res: any) => {
  let artist = {
    text: req.body.text,
    checked: req.body.checked === "true"
  };
  console.log(req.body)
  db.collection('artists').insertOne(artist, async (err: any, result: any) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    const f = await db.collection('artists').find().sort({id: -1}).limit(1).toArray();
    res.send({id: f[0]._id});
  })
})

app.put('/api/v1/items', async (req: any, res: { send: (arg0: string) => void }) => {
  try {
    await db.collection('artists').updateOne({'_id': new ObjectId(req.body.id)},
      {
        $set: {
          'text': req.body.text,
          'checked': req.body.checked
        }
      })
  } catch (e) {
    console.log('some thing wrong in put function')
  }
  res.send('ok: true');
});

app.delete('/api/v1/items', async (req: any, res: { send: (arg0: Object) => void }) => {
  try {
    await db.collection('artists').deleteOne({_id: new ObjectId(req.body.id)})
  } catch (e) {
    throw e
  }
  res.send({'ok': true});
})

// app.get('/*', (req: any, res: any) => res.sendFile(indexHTML));

MongoClient.connect('mongodb://root:pass@localhost:27017', function (err: any, client: any) {
  if (err) {
    return console.log(err);
  }
  db = client.db('myapi');

  db.collection('artists').find().forEach((item: TodoItem) => {
    items.push(item);
  });
  app.listen(port, function () {
    console.log('API app started');
  })
})
