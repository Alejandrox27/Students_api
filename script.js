const select = document.getElementById("select");

async function loaded(){
    await fetch("http://127.0.0.1:8000/students/v1/get-students")
        .then(res => res.json())
        .then(data => localStorage.setItem("Students" ,JSON.stringify(data)))
        .catch((e) => console.log("no data on localStorage"))

    await fetch("http://127.0.0.1:8000/teachers/v1/get-teachers")
        .then(res => res.json())
        .then(data => localStorage.setItem("Teachers", JSON.stringify(data)))
        .catch((e) => console.log("no data on localStorage"))
}

window.addEventListener("load", loaded, false);