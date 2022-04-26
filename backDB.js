"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var path = require('path');
// const indexHTML = path.resolve(__dirname, './index.html');
var express = require('express');
var app = express();
var cors = require("cors");
var MongoClient = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');
app.use(cookieParser());
// app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
var opt = {
    origin: 'http://localhost:8080',
    credentials: true
};
app.use(cors(opt));
var port = 3012;
var db;
var items = [];
app.get('/api/v1/items', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                items = [];
                return [4 /*yield*/, db.collection('artists').find().forEach(function (item) {
                        items.push({ id: item._id.toString(), text: item.text, checked: item.checked });
                    })];
            case 1:
                _a.sent();
                response = { items: items };
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                throw e_1;
            case 3:
                res.send(JSON.stringify(response));
                return [2 /*return*/];
        }
    });
}); });
app.post('/api/v1/logout', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.collection('users').updateOne({ 'sessionId': +req.headers.cookie }, {
                    $set: {
                        'sessionId': 0
                    }
                })];
            case 1:
                _a.sent();
                res.end(JSON.stringify({ "ok": true }));
                return [2 /*return*/];
        }
    });
}); });
app.post('/api/v1/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionId, user, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                sessionId = Math.random();
                return [4 /*yield*/, db.collection('users').findOne({ 'login': req.body.login })];
            case 1:
                user = _a.sent();
                if (user) {
                    res.end(JSON.stringify({ "ok": true }));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db.collection('users').insertOne({ 'login': req.body.login, 'pass': req.body.pass, 'sessionId': sessionId })];
            case 2:
                _a.sent();
                return [4 /*yield*/, res.writeHead(200, {
                        "Set-Cookie": sessionId
                    })];
            case 3:
                _a.sent();
                res.end(JSON.stringify({ "ok": true }));
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                throw e_2;
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post('/api/v1/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.collection('users').findOne({ 'login': req.body.login })];
            case 1:
                item = _a.sent();
                if (!!item) return [3 /*break*/, 2];
                res.send({ "error": 'not found' });
                return [3 /*break*/, 9];
            case 2:
                if (!!req.headers.cookie) return [3 /*break*/, 6];
                if (!(item.pass === req.body.pass)) return [3 /*break*/, 4];
                return [4 /*yield*/, res.writeHead(200, {
                        "Set-Cookie": item.sessionId
                    })];
            case 3:
                _a.sent();
                res.end(JSON.stringify({ "ok": true }));
                return [3 /*break*/, 5];
            case 4:
                res.send({ "error": 'not found' });
                _a.label = 5;
            case 5: return [3 /*break*/, 9];
            case 6:
                if (!(item.pass === req.body.pass)) return [3 /*break*/, 8];
                return [4 /*yield*/, db.collection('users').updateOne({ 'login': req.body.login }, {
                        $set: {
                            'sessionId': +req.headers.cookie
                        }
                    })];
            case 7:
                _a.sent();
                res.send({ "ok": true });
                return [3 /*break*/, 9];
            case 8:
                res.send({ "error": 'not found' });
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
app.post('/api/v1/items', function (req, res) {
    var artist = {
        text: req.body.text,
        checked: req.body.checked === "true"
    };
    console.log(req.body);
    db.collection('artists').insertOne(artist, function (err, result) { return __awaiter(void 0, void 0, void 0, function () {
        var f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        console.log(err);
                        return [2 /*return*/, res.sendStatus(500)];
                    }
                    return [4 /*yield*/, db.collection('artists').find().sort({ id: -1 }).limit(1).toArray()];
                case 1:
                    f = _a.sent();
                    res.send({ id: f[0]._id });
                    return [2 /*return*/];
            }
        });
    }); });
});
app.put('/api/v1/items', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.collection('artists').updateOne({ '_id': new mongodb_1.ObjectId(req.body.id) }, {
                        $set: {
                            'text': req.body.text,
                            'checked': req.body.checked
                        }
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                console.log('some thing wrong in put function');
                return [3 /*break*/, 3];
            case 3:
                res.send('ok: true');
                return [2 /*return*/];
        }
    });
}); });
app["delete"]('/api/v1/items', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.collection('artists').deleteOne({ _id: new mongodb_1.ObjectId(req.body.id) })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                throw e_4;
            case 3:
                res.send({ 'ok': true });
                return [2 /*return*/];
        }
    });
}); });
// app.get('/*', (req: any, res: any) => res.sendFile(indexHTML));
MongoClient.connect('mongodb://root:pass@localhost:27017', function (err, client) {
    if (err) {
        return console.log(err);
    }
    db = client.db('myapi');
    db.collection('artists').find().forEach(function (item) {
        items.push(item);
    });
    app.listen(port, function () {
        console.log('API app started');
    });
});
