


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
    screen.addEventListener('click', function (ev) {
        let bounds = this.getBoundingClientRect();
        var left = bounds.left;
        var top = bounds.top;
        var x = ev.pageX - left;
        var y = ev.pageY - top;
        var cw = this.clientWidth
        var ch = this.clientHeight
        var iw = this.naturalWidth
        var ih = this.naturalHeight
        var px = x / cw * iw
        var py = y / ch * ih


        console.log({ px, py })
        click(px, py, "left")

    })
}


client.onmessage = ({ data }) => {
    screen.src = `data:image/png;base64, ${data}`
}