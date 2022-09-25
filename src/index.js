const express = require("express")
const robot = require("robotjs")
const http = require("http");
const ws = require("ws")



const app = express()
const server = http.createServer(app);
const wsServer = new ws.Server({ server })


app.use(express.json)

wsServer.on("connection", (socket) => {
    console.log("new connection")
})

// * mouse control
app.post("/input/click", (req) => {
    const { x, y, click } = req.body;

    robot.moveMouse(x, y)
    robot.mouseClick(click)
})

// * keyboard control
app.post("/input/keypress", (req) => {
    const { key } = req.body;
    console.log({ key })
    robot.keyTap(key)

})


// * scrolling
app.post("/input/scroll", (req) => {
    const { direction } = req.body;

    const speed = 50;
    robot.scrollMouse(direction == "up" ? speed : -speed)

})

app.use('/', express.static(__dirname + '/front'));

// setInterval(() => {
//     const screenshot = robot.screen.capture()
// }, 50)

const port = "1337"



server.listen(port, () => console.log(`listening on port ${port}`))