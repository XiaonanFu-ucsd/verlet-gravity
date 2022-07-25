import * as THREE from "./lib/three.module.js"

const minX = -300
const maxX = -1 * minX;
const minY = -200;
const maxY = -1 * minY;
const minZ = -1000;
const maxZ = 50;

const minV = -1.1;
const maxV = -1 * minV;

const minMass = 10000;
const maxMass = 300000;

const timeIntervel = 1;
const G = 6.6743 / 1000;

export class Particle {
    pos;
    v;
    lastPos;
    F;
    m = minMass;
    constructor(x, y, z, vx, vy, vz, m) {
        if (x === undefined || y === undefined || z === undefined || vx === undefined || vy === undefined || vz === undefined || m === undefined) {
            this.pos = new THREE.Vector3(ranNum(minX, maxX), ranNum(minY, maxY), ranNum(minZ, maxZ));
            this.v = new THREE.Vector3(ranNum(minV, maxV), ranNum(minV, maxV), ranNum(minV, maxV));
            this.lastPos = new THREE.Vector3(0, 0, 0);
            this.lastPos.copy(this.pos);
            this.lastPos.sub(this.v.multiplyScalar(timeIntervel));
            this.m = Math.random() * (maxMass - minMass) + minMass;
        } else {
            this.pos = new THREE.Vector3(x, y, z);
            this.v = new THREE.Vector3(vx, vy, vz);
            this.lastPos = new THREE.Vector3(0, 0, 0);
            this.lastPos.copy(this.pos);
            this.lastPos.sub(this.v.multiplyScalar(timeIntervel));
            this.m = m;
        }
        this.F = new THREE.Vector3(0, 0, 0);
    }

    sync() {
        //console.log("before sync", this.pos); ///////////////

        let a = new THREE.Vector3(0, 0, 0);
        a.copy(this.F);
        a.divideScalar(this.m);
        this.F = new THREE.Vector3(0, 0, 0);

        //console.log("after acc", a); ////////

        let newPos = new THREE.Vector3(0, 0, 0);
        newPos.add(this.pos);

        //console.log("v-before sec term", this.v, this.lastPos, this.pos); ////////
        this.v.copy(this.pos);
        this.v.sub(this.lastPos);
        this.v.divideScalar(timeIntervel);

        let secondTerm = new THREE.Vector3(0, 0, 0);
        secondTerm.copy(this.v);
        secondTerm.multiplyScalar(timeIntervel)
        newPos.add(secondTerm);
        //console.log("after sec term", this.v); ////////

        let thirdTerm = new THREE.Vector3(0, 0, 0);
        thirdTerm.copy(a);
        thirdTerm.multiplyScalar(timeIntervel ** 2 / 2);

        newPos.add(thirdTerm);
        //console.log("after 3 term", newPos); ////////

        this.lastPos = this.pos;
        this.pos = newPos;
        //console.log("after sync", this.pos); ////////
    }

    gravity(p2) {
        let F_mag = this.m * p2.m * G / this.pos.distanceTo(p2.pos) ** 2;
        let F_dirc = new THREE.Vector3(0, 0, 0);
        F_dirc.subVectors(p2.pos, this.pos);
        F_dirc.setLength(F_mag);
        this.F.add(F_dirc);
    }


    getVector3() {
        return new THREE.Vector3(x, y, z);
    }
}

function ranNum(low, high) {
    return Math.random() * (high - low) + low;
}