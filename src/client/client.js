




const url = document.location.host;
const client = new WebSocket(`ws://${url}`)



client.onopen = () => {
    document.getElementById("info").textContent = "connecté !"


    window.addEventListener("keypress", ({ key }) => {
        fetch("input/keypress", {

            method: "POST",
            body: JSON.stringify({
                key
            })
        })
    })
}