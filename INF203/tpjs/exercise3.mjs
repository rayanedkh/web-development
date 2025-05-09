"use strict";

export class Stdt {
    constructor(lastName, firstName, id) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.id = id;
    }

    toString() {
        return `student: ${this.lastName}, ${this.firstName}, ${this.id}`;
    }
}

export class ForStudent extends Stdt {
    constructor(lastName, firstName, id, nationality) {
        super(lastName, firstName, id);
        this.nationality = nationality;
    }

    toString() {
        return `${super.toString()}, ${this.nationality}`;
    }
}