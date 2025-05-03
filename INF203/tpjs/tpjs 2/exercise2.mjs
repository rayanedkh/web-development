"use strict";

export function wcount(str) {
    let words = str.split(" ");
    let count = {};
    for (let word of words) {
        count[word] = (count[word] || 0) + 1;
    }
    return count;
}

export class WordL {
    constructor(str) {
        this.wordCounts = wcount(str);
        this.words = Object.keys(this.wordCounts).sort(); // Stocker les mots triés
    }

    getWords() {
        return [...this.words]; // Retourne une copie du tableau trié
    }

    maxCountWord() {
        let maxCount = -Infinity;
        let result = '';
        for (const word of this.words) {
            const count = this.wordCounts[word]; // Corriger la référence
            if (count > maxCount) {
                maxCount = count;
                result = word;
            }
        }
        return result;
    }

    minCountWord() {
        let minCount = Infinity;
        let result = '';
        for (const word of this.words) {
            const count = this.wordCounts[word]; // Corriger la référence
            if (count < minCount) {
                minCount = count;
                result = word;
            }
        }
        return result;
    }

    getCount(word) {
        return this.wordCounts[word] || 0;
    }

    applyWordFunc(f) {
        return this.words.map(f);
    }
}