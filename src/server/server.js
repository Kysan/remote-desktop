const express = require("express")
const robot = require("robotjs")
const http = require("http");
const ws = require("ws")
const path = require("path")


const app = express()
// const server = http.createServer(app);
// const wsServer = new ws.Server({ server })


app.use(express.json())
const staticPath = path.join(__dirname, './../client/')
console.log({ staticPath })
app.use('/', express.static(staticPath));

// wsServer.on("connection", (socket) => {
//     console.log("new connection")
// })


app.get("/test", (_, res) => res.send("pong"))

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

// setInterval(() => {
//     const screenshot = robot.screen.capture()
// }, 50)







const { port } = require("../../config.json")

app.listen(port, () => console.log(`listening on port ${port}`))