


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
        const bounds = this.getBoundingClientRect();
        var left = bounds.left;
        var top = bounds.top;
        var x = ev.pageX - left;
        var y = ev.pageY - top;
        var cw = bounds.width;
        var ch = bounds.height;
        var iw = 1980; // chercher sur google dom get original image res
        var ih = 1080;
        var px = Math.round(x * iw / cw)
        var py = Math.round(y * ih / ch)

        click(px, py, "right")
    });


    // * left click
    screen.addEventListener('click', function (ev) {
        const bounds = this.getBoundingClientRect();
        var left = bounds.left;
        var top = bounds.top;
        var x = ev.pageX - left;
        var y = ev.pageY - top;
        var cw = bounds.width;
        var ch = bounds.height;
        var iw = 1980; // chercher sur google dom get original image res
        var ih = 1080;
        var px = Math.round(x * iw / cw)
        var py = Math.round(y * ih / ch)

        console.log({ px, py })
        click(px, py, "left")

    })
}


client.onmessage = ({ data }) => {
    screen.src = `data:image/png;base64, ${data}`
}