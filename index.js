import * as THREE from "./lib/three.module.js"
import { render, add_particle } from "./render.js"
import { Particle } from "./Particle.js"

var particles = [];

function init() {
    setTimeout(() => {
        document.getElementById("prmt-press-key").style.opacity = 0;
    }, 1500);


    add_p();
    add_p();
    add_p();
}
init();

function add_p() {
    let p = new Particle();
    particles.push(p);
    add_particle(p.pos, (p.m / 1000) ** 0.7);
}

function add_sun() {
    let p = new Particle(0, 0, 0, 0, 0, 0, 800000);
    particles.push(p);
    add_particle(p.pos, (p.m / 1000) ** 0.7);
}

function nextframe() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = 0; j < particles.length; j++) {
            if (j != i) {
                particles[i].gravity(particles[j]);
            }
        }
    }
    let currentPos = [];
    for (let i = 0; i < particles.length; i++) {
        particles[i].sync();
        currentPos.push(particles[i].pos);
    }
    render(currentPos);
    requestAnimationFrame(nextframe);
}
nextframe();

function updatePosInfo() {
    let infoArea = document.getElementById("info");
    let text = "";
    for (let i = 0; i < particles.length; i++) {
        let xyz = particles[i].pos;
        text += "particle-" + (i + 1);
        //text += "  < " + xyz.x + "   " + xyz.y + "   " + xyz.z + " >";
        text += "  < " + Number(xyz.x).toFixed(2) + "   " + Number(xyz.y).toFixed(2) + "   " + Number(xyz.z).toFixed(2) + " >";
        text += "\n";
    }
    infoArea.textContent = text;
}
updatePosInfo();
setInterval(updatePosInfo, 200);

window.addEventListener("keydown", event => {
    add_p();
});