"use strict";

import { Stdt, ForStudent } from "./exercise3.mjs";
import fs from "fs";

// Définition de la classe Promo
export class Promo {
    constructor() {
        this.students = [];
    }

    add(student) {
        this.students.push(student);
    }

    size() {
        return this.students.length;
    }

    get(i) {
        return this.students[i];
    }

    print() {
        const output = this.students.map(student => student.toString()).join("\n");
        console.log(output);
        return output;
    }

    write() {
        return JSON.stringify(this.students);
    }

    read(str) {
        const data = JSON.parse(str);
        this.students = data.map(s => 
            s.nationality 
                ? new ForStudent(s.lastName, s.firstName, s.id, s.nationality) 
                : new Stdt(s.lastName, s.firstName, s.id)
        );
    }

    saveTo(fileName) {
        fs.writeFileSync(fileName, this.write(), "utf-8");
    }

    readFromFile(fileName) {
        const data = fs.readFileSync(fileName, "utf-8");
        this.read(data);
    }
}