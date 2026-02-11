const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const dataFile = "queueData.json";

function readQueue() {
    const data = fs.readFileSync(dataFile);
    return JSON.parse(data);
}

function writeQueue(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.post("/addToken", (req, res) => {
    const { name, service } = req.body;
    let queue = readQueue();

    const newToken = {
        token: queue.length + 1,
        name,
        service,
        status: "waiting"
    };

    queue.push(newToken);
    writeQueue(queue);

    res.json(newToken);
});

app.get("/queue", (req, res) => {
    res.json(readQueue());
});

app.post("/next", (req, res) => {
    let queue = readQueue();
    const next = queue.find(q => q.status === "waiting");

    if (next) {
        next.status = "served";
        writeQueue(queue);
        res.json(next);
    } else {
        res.json({ message: "No waiting tokens" });
    }
});

app.post("/reset", (req, res) => {
    writeQueue([]);
    res.json({ message: "Queue reset" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
