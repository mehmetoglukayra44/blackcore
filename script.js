```javascript
// BLACKCORE
// Cyber Background Animation

const container = document.getElementById("matrix");

for(let i=0;i<120;i++){

    const line=document.createElement("div");

    line.className="matrix-line";

    line.style.left=Math.random()*100+"vw";

    line.style.animationDuration=(4+Math.random()*8)+"s";

    line.style.animationDelay=(Math.random()*5)+"s";

    line.style.opacity=Math.random();

    line.innerHTML="010101101001011001010101010110101001010101001";

    container.appendChild(line);

}



// Fade In Sections

const sections=document.querySelectorAll("section");

const observer=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity="1";

            entry.target.style.transform="translateY(0px)";

        }

    });

},{threshold:0.15});

sections.forEach(section=>{

    section.style.opacity="0";

    section.style.transform="translateY(40px)";

    section.style.transition="0.8s";

    observer.observe(section);

});



// Card Hover Glow

document.querySelectorAll(".card").forEach(card=>{

    card.addEventListener("mousemove",()=>{

        card.style.boxShadow="0 0 30px rgba(0,255,136,.35)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.boxShadow="";

    });

});



// Hero Animation

const hero=document.querySelector(".hero-box");

hero.animate(

[
{opacity:0,transform:"translateY(-30px)"},
{opacity:1,transform:"translateY(0px)"}
],
{
duration:1000,
fill:"forwards"
}

);



// Logo Pulse

const logo=document.querySelector(".logo");

setInterval(()=>{

logo.animate([

{transform:"scale(1)"},

{transform:"scale(1.05)"},

{transform:"scale(1)"}

],{

duration:1200

});

},3500);



// Smooth Glow Effect

setInterval(()=>{

document.querySelectorAll(".card").forEach(card=>{

card.style.borderColor="rgba(0,255,136,"+(0.15+Math.random()*0.35)+")";

});

},1200);
```
