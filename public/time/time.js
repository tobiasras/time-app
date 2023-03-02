let isRunning = false;
let isStart = true;
let lastDate;
let startPoint;


fetch("/api/times").then(response => response.json()).then(body => {
    body.data.forEach(timeString => {
        const timeMS = Date.parse(timeString);
        let date = new Date(timeMS);

        addTimeToTable(date);
    })

})

function timeSwitch() {
    let button = document.getElementById("time-switch");

    isRunning = !isRunning;

    if (isRunning) {
        button.innerText = "Stop";
    } else {
        button.innerText = "Start";
    }

    if (isRunning) {
        if (isStart) {
            isStart = false;
            startPoint = new Date();
            timer();
        } else {
            const now = new Date();
            let count = now.getTime() - lastDate.getTime();
            startPoint = new Date(count);
            timer();
        }
    }

}

function displayTime(time) {
    const mseconds = document.getElementById("mseconds");
    const seconds = document.getElementById("seconds");
    const minutes = document.getElementById("minutes");
    const hour = document.getElementById("hour");

    mseconds.innerText = time.getMilliseconds().toLocaleString("en-us", {minimumIntegerDigits: 3});
    seconds.innerText = time.getSeconds().toLocaleString("en-us", {minimumIntegerDigits: 2});
    minutes.innerText = time.getMinutes().toLocaleString("en-us", {minimumIntegerDigits: 2});
    hour.innerText = (time.getHours() - 1).toLocaleString("en-us", {minimumIntegerDigits: 2});
}

function resetTime() {
    isRunning = false;
    const button = document.getElementById("time-switch")
    button.innerText = "Start";
    isStart = true;
    lastDate = new Date(0);

    fetch("/api/times", {
        method: "DELETE"
    });

    flushTimeTable();

    displayTime(new Date(0));
}

function timer() {
    if (isRunning) {
        let count = new Date().getTime() - startPoint.getTime();
        let time = new Date(count);
        lastDate = time;
        displayTime(time);
    }
    setTimeout(timer, 25);
}

function recordTime(){

    fetch("api/times?time=" + lastDate.getTime(), {
        method: "POST",
    }).then(response => response.json()).then(result => {

        flushTimeTable();

        result.data.forEach(timeString => {
            const timeMS = Date.parse(timeString);
            let date = new Date(timeMS);

            addTimeToTable(date);
        })
    })
}

function flushTimeTable(){
    const listOfTimes = document.getElementById("recorded-times");

    while (listOfTimes.firstChild){
        listOfTimes.removeChild(listOfTimes.firstChild);
    }
}

function addTimeToTable(time){
    const listOfTimes = document.getElementById("recorded-times");

    // Strings ...
    const ms = time.getMilliseconds().toLocaleString("en-us", {minimumIntegerDigits: 3});
    const sec = time.getSeconds().toLocaleString("en-us", {minimumIntegerDigits: 2});
    const min = time.getMinutes().toLocaleString("en-us", {minimumIntegerDigits: 2});
    const hour = (time.getHours() - 1).toLocaleString("en-us", {minimumIntegerDigits: 2});

    const li = document.createElement("li");

    li.innerText = hour + ":" + min + ":" + sec + ":" + ms

    listOfTimes.append(li);
}
