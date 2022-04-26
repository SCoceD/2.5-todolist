// const express = require('express');
// const fs = require('fs');
// const app = express();
// const path = '/home/apolieshchuk/Downloads/MenthorCourse-master/TypeScript/src/2.5/todos.json';
// app.use(express.json());
// app.use(express.urlencoded({
//   extended: true
// }));
//
// const port = 3000;
//
// // TS
// interface TodoItem {
//   id: number,
//   text: string,
//   checked: boolean
// }
//
// let counter = 2
//
// let items: TodoItem[] = [
//   {id: 1, text: 'Start Task', checked: false}
// ];
//
// app.get('/api/v1/items', (req: any, res: { send: (arg0: string) => void; }) => {
//   const response = {items: items};
//   res.send(JSON.stringify(response));
// })
//
// app.post('/api/v1/items', (req: any, res: { send: (arg0: string) => void }) => {
//   const file = fs.readFileSync(path, {encoding: 'utf-8'});
//   items = JSON.parse(file).items;
//   items.push({id: counter, text: req.body.text, checked: false})
//   fs.writeFileSync(path, JSON.stringify({counter: counter, items: items}));
//   res.send('id: ' + counter++)
// })
//
// app.put('/api/v1/items', (req: any, res: { send: (arg0: string) => void }) => {
//   const file = fs.readFileSync(path, {encoding: 'utf-8'});
//   items = JSON.parse(file).items;
//   items.forEach((item, i) => {
//     if (+item.id === +req.body.id) {
//       items[i] = {id: item.id, text: req.body.text, checked: req.body.checked};
//     }
//   })
//   fs.writeFileSync(path, JSON.stringify({counter: counter, items: items}));
//   res.send('ok: true');
// });
//
// app.delete('/api/v1/items', (req: any, res: { send: (arg0: string) => void }) => {
//   fs.read(path, (err: any, data: any) => {
//     items = data.items;
//   });
//   items.splice(req.body.id - 1, 1);
//   res.send('ok: true');
//   fs.writeFile(path, JSON.stringify({counter: counter, items: items}), (err: any) => {
//     if (err) throw err;
//   });
// })
//
// app.listen(port, () => {
//   if (!fs.existsSync(path)) {
//     fs.open(path, 'w', (err: any) => {
//       if (err) throw err;
//     });
// console.log('cfghvjhbknlk')
//     fs.appendFile(path, JSON.stringify({counter: counter, items: items}), (err: any) => {
//       if (err) throw err;
//     });
//   }else {
//     const file = fs.readFileSync(path, {encoding: 'utf-8'});
//     items = JSON.parse(file).items;
//     counter = JSON.parse(file).counter;
//   }
//   console.log(`Example app listening on port ${port}`)
// })
//
