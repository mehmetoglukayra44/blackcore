// ======================
// BLACKCORE
// script.js
// ======================

// Matrix benzeri arka plan
const matrix = document.getElementById("matrix");

for (let i = 0; i < 120; i++) {

    const line = document.createElement("div");

    line.className = "matrix-line";

    line.innerHTML = "010101010101101010101001101010101";

    line.style.left = Math.random() * 100 + "vw";

    line.style.animationDuration = (5 + Math.random() * 8) + "s";

    line.style.animationDelay = Math.random() * 5 + "s";

    line.style.opacity = Math.random();

    matrix.appendChild(line);

}



// Sayfa animasyonu

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0px)";

}

});

},{threshold:.15});

document.querySelectorAll("section").forEach(section=>{

section.style.opacity="0";

section.style.transform="translateY(60px)";

section.style.transition=".8s";

observer.observe(section);

});



// Yukarı çık butonu

const topBtn=document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

topBtn.style.opacity="1";

topBtn.style.pointerEvents="all";

}else{

topBtn.style.opacity="0";

topBtn.style.pointerEvents="none";

}

});

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};



// Header efekti

const header=document.querySelector("header");

window.addEventListener("scroll",()=>{

if(window.scrollY>60){

header.style.boxShadow="0 0 30px rgba(0,255,136,.15)";

}else{

header.style.boxShadow="none";

}

});



// Kart hover efekti

document.querySelectorAll(".card").forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

card.style.background=

`radial-gradient(circle at ${x}px ${y}px,
rgba(0,255,136,.10),
#0d0d0d 55%)`;

});

card.addEventListener("mouseleave",()=>{

card.style.background="#0d0d0d";

});

});



// SSS Aç/Kapa

document.querySelectorAll(".faq-item h3").forEach(title=>{

title.addEventListener("click",()=>{

const p=title.nextElementSibling;

if(p.style.display==="block"){

p.style.display="none";

}else{

p.style.display="block";

}

});

});



// Hero yazısı

const hero=document.querySelector(".hero-content");

hero.animate(

[

{

opacity:0,

transform:"translateY(-30px)"

},

{

opacity:1,

transform:"translateY(0px)"

}

],

{

duration:1000,

fill:"forwards"

}

);



// Logo pulse

const logo=document.querySelector(".logo");

setInterval(()=>{

logo.animate([

{

transform:"scale(1)"

},

{

transform:"scale(1.05)"

},

{

transform:"scale(1)"

}

],{

duration:1200

});

},3000);



// Mouse Glow

const glow=document.querySelector(".glow1");

document.addEventListener("mousemove",(e)=>{

glow.animate({

left:e.clientX-250+"px",

top:e.clientY-250+"px"

},{

duration:600,

fill:"forwards"

});

});



// Kart giriş animasyonu

const cards=document.querySelectorAll(".card");

cards.forEach((card,index)=>{

card.animate([

{

opacity:0,

transform:"translateY(50px)"

},

{

opacity:1,

transform:"translateY(0px)"

}

],{

delay:index*120,

duration:700,

fill:"forwards"

});

});



// Console Mesajı

console.log(

"%cBLACKCORE",

"color:#00ff88;font-size:35px;font-weight:bold;"

);

console.log("Welcome.");
