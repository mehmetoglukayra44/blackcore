const button = document.getElementById("save");
const note = document.getElementById("note");
const saved = document.getElementById("savedText");

if(localStorage.getItem("note")){

    note.value=localStorage.getItem("note");

    saved.innerHTML="Kaydedilmiş Not:<br><br>"+localStorage.getItem("note");

}

button.onclick=()=>{

    localStorage.setItem("note",note.value);

    saved.innerHTML="Kaydedilmiş Not:<br><br>"+note.value;

}
