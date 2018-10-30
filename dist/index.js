"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
//import webpacDevMiddleware from 'webpack-dev-middleware';
var middleware_1 = __importDefault(require("./middleware"));
//import pgp from 'pg-promise';
var ws_1 = __importDefault(require("ws"));
var pgp = require('pg-promise')();
var pg = require('pg');
var body_parser_1 = __importDefault(require("body-parser"));
var app = express_1.default();
app.use(body_parser_1.default.json()); // to support JSON-encoded bodies
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
var webSocket;
var db = pgp('postgres://darshan:block8@localhost:5432/testdb');
var socket = new ws_1.default.Server({ port: 8081 });
socket.broadcast = function broadcast(data) {
    socket.clients.forEach(function each(client) {
        console.log('IT IS GETTING INSIDE CLIENTS');
        //console.log(client);
        console.log(data);
        client.send(data);
    });
};
socket.on('connection', function connection(ws) {
    webSocket = ws;
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        socket.broadcast(message);
        ws.send('Received message: ' + message);
    });
    ws.send('Connection to websocket created successfully');
});
var client = new pg.Client('postgres://darshan:block8@localhost:5432/testdb');
client.connect(function (err) {
    if (err) {
        return console.error('could not connect to postgres', err);
    }
    client.connect();
    client.query('LISTEN "event"');
    client.on('notification', function (data) {
        console.log(data.payload);
        //webSocket.send(data.payload);
        socket.broadcast(data.payload);
    });
});
app.post("/deleteRow", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var user_name, user_age, result, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_name = req.body.name;
                user_age = req.body.age;
                console.log("DELETE FROM test WHERE name='" + user_name + "' AND age=" + user_age);
                return [4 /*yield*/, db.any("DELETE FROM test WHERE name='" + user_name + "' AND age=" + user_age)];
            case 1:
                result = _a.sent();
                console.log(result);
                return [2 /*return*/, res.send('Row deleted successfully')];
            case 2:
                e_1 = _a.sent();
                console.log('Error: ' + e_1);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.use("/getNameUsingSocket", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var name_1, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.any('SELECT * FROM test WHERE age = $1', 21)];
            case 1:
                name_1 = _a.sent();
                console.log(name_1);
                //webSocket.send(name[0].name);
                socket.broadcast(name_1[0].name);
                res.send(name_1);
                return [2 /*return*/, name_1];
            case 2:
                e_2 = _a.sent();
                console.log('Error: ' + e_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.use("/getName", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var name_2, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.any('SELECT * FROM test WHERE age = $1', 21)];
            case 1:
                name_2 = _a.sent();
                console.log(name_2);
                return [2 /*return*/, res.send(name_2)];
            case 2:
                e_3 = _a.sent();
                console.log('Error: ' + e_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.use("/getTeamData", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var name_3, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.any('SELECT * FROM test')];
            case 1:
                name_3 = _a.sent();
                console.log(name_3);
                return [2 /*return*/, res.send(name_3)];
            case 2:
                e_4 = _a.sent();
                console.log('Error: ' + e_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/insertData', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var user_name, user_age, result, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_name = req.body.name;
                user_age = req.body.age;
                console.log("INSERT INTO test (name, age) VALUES ('" + user_name + "', " + user_age + ")");
                return [4 /*yield*/, db.any("INSERT INTO test (name, age) VALUES ('" + user_name + "', " + user_age + ")")];
            case 1:
                result = _a.sent();
                console.log(result);
                return [2 /*return*/, res.send('Data added successfully')];
            case 2:
                e_5 = _a.sent();
                console.log('Error: ' + e_5);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.use("/helloworld", function (req, res) {
    res.send("Hello World!!");
});
middleware_1.default(app, {
    outputPath: path_1.default.resolve(process.cwd(), 'dist'),
    publicPath: '/'
});
app.listen(3000, function () {
    console.log('application recieving request on port 3000');
});
