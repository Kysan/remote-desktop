const express = require("express")
const robot = require("robotjs")
const http = require("http");
const ws = require("ws")
const path = require("path")


const app = express()
app.use(express.json())





const server = http.createServer(app);
const wsServer = new ws.Server({ server })

const staticPath = path.join(__dirname, './../client/')
app.use('/', express.static(staticPath));

wsServer.on("connection", (socket) => {
    console.log("new connection")

    setInterval(() => {
        const screenshot = robot.screen.capture()

    }, 500)
})


app.get("/ping", (_, res) => res.send("pong"))

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








const { port } = require("../../config.json")

server.listen(port, () => console.log(`listening on port ${port}`))