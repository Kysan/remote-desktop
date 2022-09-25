const express = require("express")
const robot = require("robotjs")
const http = require("http");
const ws = require("ws")
const path = require("path")
const jimp = require("jimp")

const app = express()
app.use(express.json())


const server = http.createServer(app);
const wsServer = new ws.Server({ server })

const staticPath = path.join(__dirname, './../client/')
app.use('/', express.static(staticPath));

wsServer.on("connection", (socket) => {
    console.log("new connection")

    setInterval(async () => {
        const screenshot = robot.screen.capture()
        const img = convert(screenshot)
        const buff = await img.getBufferAsync(jimp.MIME_PNG)
        socket.send(buff.toString('base64'))
    }, 50)
})


app.get("/ping", (_, res) => res.send("pong"))

// * mouse control
app.post("/input/click", (req) => {
    const { x, y, button } = req.body;
    // Accepts left, right, or middle.
    console.log({ x, y })
    robot.moveMouseSmooth(x, y)
    robot.mouseClick("left")
})

// * keyboard control
app.post("/input/keypress", (req) => {
    const { key } = req.body;

    if (!"abcdefghijklmnopqrstuvwxyz0123456789".includes(key)) return;

    console.log({ key })
    robot.keyTap(key)

})


// * scrolling
app.post("/input/scroll", (req) => {
    const { direction } = req.body;

    const speed = 50;
    robot.scrollMouse(direction == "up" ? speed : -speed)

})




const convert = (image) => {
    for (let i = 0; i < image.image.length; i++) {
        if (i % 4 == 0) {
            [image.image[i], image.image[i + 2]] = [image.image[i + 2], image.image[i]];
        }
    }

    let jimg = new jimp(image.width, image.height);
    jimg.bitmap.data = image.image;
    return jimg
}





const { port, interface } = require("../../config.json")

server.listen(port, interface, () => {
    const { interfaces } = require("./NetworkUtils")
    console.log({ listeningPort: port, interfaces })
})