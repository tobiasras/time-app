const express = require("express")
const app = express();

app.use(express.static("public"));

let recordedTimes = [];



// pages
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/time/time.html");
})


// api
app.get("/api/times", (req, res) => {
    res.send({data: recordedTimes})
})

app.post("/api/times", (req, res) => {
    if (req.query.time){
        const time = req.query.time;

        recordedTimes.push(new Date(+time));

        res.send({data: recordedTimes})
    } else {
        res.status(400);
        res.send("bad request")
    }
})


app.delete("/api/times", (req, res) => {
    recordedTimes = [];
    res.send();
})


app.listen(8080);