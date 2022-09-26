


const screen = document.getElementById("screen")
const url = document.location.host;
const client = new WebSocket(`ws://${url}`)


const click = (x, y, button) => {
    fetch("input/click", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ x: x, y: y, button })
    })
}


const pressKeyBoard = (key) => {
    fetch("input/keypress", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key })
    })
}


client.onopen = () => {
    console.log("connected")

    // * keyboard
    window.addEventListener("keypress", ({ key }) => pressKeyBoard(key))

    // * right click
    screen.addEventListener('contextmenu', ev => {
        ev.preventDefault();
        const { layerX: x, layerY: y } = ev;

        click(x, y, "right")
    });


    // * left click
    screen.addEventListener('click', (ev) => {
        const { layerX: x, layerY: y, which } = ev;
        console.log({ ev })
        click(x, y, "left")
    })
}


client.onmessage = ({ data }) => {
    screen.src = `data:image/png;base64, ${data}`
}