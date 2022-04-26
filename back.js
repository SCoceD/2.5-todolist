var express = require('express');
var fs = require('fs');
var app = express();
var path = '/home/apolieshchuk/Downloads/MenthorCourse-master/TypeScript/src/2.5/todos.json';
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
var port = 3000;
var counter = 2;
var items = [
    { id: 1, text: 'Start Task', checked: false }
];
app.get('/api/v1/items', function (req, res) {
    var response = { items: items };
    res.send(JSON.stringify(response));
});
app.post('/api/v1/items', function (req, res) {
    var file = fs.readFileSync(path, { encoding: 'utf-8' });
    items = JSON.parse(file).items;
    items.push({ id: counter, text: req.body.text, checked: false });
    fs.writeFileSync(path, JSON.stringify({ counter: counter, items: items }));
    res.send('id: ' + counter++);
});
app.put('/api/v1/items', function (req, res) {
    var file = fs.readFileSync(path, { encoding: 'utf-8' });
    items = JSON.parse(file).items;
    items.forEach(function (item, i) {
        if (+item.id === +req.body.id) {
            items[i] = { id: item.id, text: req.body.text, checked: req.body.checked };
        }
    });
    fs.writeFileSync(path, JSON.stringify({ counter: counter, items: items }));
    res.send('ok: true');
});
app["delete"]('/api/v1/items', function (req, res) {
    fs.read(path, function (err, data) {
        items = data.items;
    });
    items.splice(req.body.id - 1, 1);
    res.send('ok: true');
    fs.writeFile(path, JSON.stringify({ counter: counter, items: items }), function (err) {
        if (err)
            throw err;
    });
});
app.listen(port, function () {
    if (!fs.existsSync(path)) {
        fs.open(path, 'w', function (err) {
            if (err)
                throw err;
        });
        console.log('cfghvjhbknlk');
        fs.appendFile(path, JSON.stringify({ counter: counter, items: items }), function (err) {
            if (err)
                throw err;
        });
    }
    else {
        var file = fs.readFileSync(path, { encoding: 'utf-8' });
        items = JSON.parse(file).items;
        counter = JSON.parse(file).counter;
    }
    console.log("Example app listening on port ".concat(port));
});
