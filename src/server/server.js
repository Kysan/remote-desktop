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


let intervalId;

let _sendScreen = (socket) => {
    return (() => {
        setTimeout(async () => {
            const screenshot = robot.screen.capture(0, 0, 1920, 1080)
            const img = convert(screenshot)
            const buff = await img.getBufferAsync(jimp.MIME_PNG)
            socket.send(buff.toString('base64'))
        }, 300)

    })
}


let sendScreen = () => { }

wsServer.on("connection", (socket) => {
    console.log("new connection")

    sendScreen = _sendScreen(socket)
    sendScreen()
    // if (intervalId) {
    //     clearInterval(intervalId)
    // }

    // intervalId = setInterval(async () => {
    //     const screenshot = robot.screen.capture(0, 0, 1920, 1080)
    //     const img = convert(screenshot)
    //     const buff = await img.getBufferAsync(jimp.MIME_PNG)
    //     socket.send(buff.toString('base64'))
    // }, 50)




})


app.get("/screen", (_, res) => {
    sendScreen()
})

// * mouse control
app.post("/input/click", (req) => {
    const { x, y, button } = req.body;
    // Accepts left, right, or middle.
    console.log({ x, y })
    // robot.moveMouseSmooth(x, y, 10)
    robot.moveMouse(x, y)
    robot.mouseClick("left")
    sendScreen()
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

    setInterval(sendScreen, 2000)
})