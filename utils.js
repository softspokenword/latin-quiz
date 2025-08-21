import { uniqueNamesGenerator, adjectives, animals, NumberDictionary } from 'unique-names-generator';

/*
Get the actual size of a resource downloaded by the browser (e.g. an image) in bytes.
This is supported in recent versions of all major browsers, with some caveats.
See https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/encodedBodySize
*/
export function getResourceSize(url) {
    const entry = window?.performance?.getEntriesByName(url)?.[0];
    if (entry) {
        const size = entry?.encodedBodySize;
        return size || undefined;
    } else {
        return undefined;
    }
}

// Note: this only works on the server side
export function getNetlifyContext() {
    return process.env.CONTEXT;
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const uniqueNamesConfig = {
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2
};

export function uniqueName() {
    return uniqueNamesGenerator(uniqueNamesConfig) + "-" + randomInt(100, 999);
}

export const uploadDisabled = process.env.NEXT_PUBLIC_DISABLE_UPLOADS?.toLowerCase() === "true";

// Load wordref data
let wordref;
try {
    wordref = require('./data/wordref.json');
} catch (error) {
    console.warn('Could not load wordref.json, using fallback data');
    // Fallback data structure
    wordref = {
        declensions: {},
        words: {}
    };
}

// Quiz generation utilities
export class QuizGenerator {
    constructor(settings) {
        this.settings = settings;
        this.wordref = wordref;
        this.questions = [];
    }

    // Generate a complete quiz based on settings
    generateQuiz() {
        const questions = [];
        
        for (let i = 0; i < this.settings.length; i++) {
            const questionType = Math.floor(Math.random() * 3) + 1; // Random question type 1-3
            const question = this.generateQuestion(questionType);
            if (question) {
                questions.push({
                    id: i + 1,
                    type: questionType,
                    ...question
                });
            }
        }
        
        return questions;
    }

    generateQuestion(type) {
        const declension = this.getRandomDeclension();
        const caseType = this.getRandomCase();
        const number = Math.random() < 0.5 ? 'Singular' : 'Plural';
        
        switch (type) {
            case 1:
                return this.generateFormat1Question(declension, number, caseType);
            case 2:
                return this.generateFormat2Question(declension, number, caseType);
            case 3:
                return this.generateFormat3Question(declension, number, caseType);
            default:
                return null;
        }
    }

    getRandomDeclension() {
        return this.settings.declensions[Math.floor(Math.random() * this.settings.declensions.length)];
    }

    getRandomCase() {
        return this.settings.cases[Math.floor(Math.random() * this.settings.cases.length)];
    }

    getRandomGender(declension) {
        switch (declension) {
            case 2:
                // 2nd declension has Masculine and Neuter
                return Math.random() < 0.5 ? 'Masculine' : 'Neuter';
            case 3:
                // 3rd declension has all three genders
                const genders = ['Masculine', 'Feminine', 'Neuter'];
                return genders[Math.floor(Math.random() * genders.length)];
            default:
                return null; // 1st, 4th, and 5th declensions don't need gender specification
        }
    }

    getRandomType(declension) {
        switch (declension) {
            case 3:
                // 3rd declension has Pure and Mixed types
                return Math.random() < 0.5 ? 'Pure' : 'Mixed';
            case 4:
                // 4th declension has 'us' and 'u' types
                return Math.random() < 0.5 ? 'us' : 'u';
            case 5:
                // 5th declension has 'ies' and 'es' types
                return Math.random() < 0.5 ? 'ies' : 'es';
            default:
                return null; // 1st and 2nd declensions don't need type specification
        }
    }

    // Format 1: Ask for ending given declension info
    generateFormat1Question(declension, number, caseType) {
        // Get random gender/type for declensions that need them
        const gender = this.getRandomGender(declension);
        const type = this.getRandomType(declension);
        
        const ending = this.getEnding(declension, number, caseType, gender, type);
        if (ending === null) return null;

        const questionText = this.formatQuestionText(declension, number, caseType, gender, type);
        const options = this.generateEndingOptions(ending, declension, number, caseType);
        
        return {
            question: questionText,
            correctAnswer: ending,
            options: options,
            declension,
            number,
            case: caseType,
            gender,
            type
        };
    }

    // Format 2: Ask for declension info given ending
    generateFormat2Question(declension, number, caseType) {
        // Get random gender/type for declensions that need them
        const gender = this.getRandomGender(declension);
        const type = this.getRandomType(declension);
        
        const ending = this.getEnding(declension, number, caseType, gender, type);
        if (ending === null) return null;

        const correctAnswer = this.formatQuestionText(declension, number, caseType, gender, type);
        const options = this.generateDeclensionOptions(correctAnswer, ending);
        
        return {
            question: `What declension has the ending: -${ending}`,
            correctAnswer: correctAnswer,
            options: options,
            declension,
            number,
            case: caseType,
            gender,
            type
        };
    }

    // Format 3: Ask for declension info given word+ending
    generateFormat3Question(declension, number, caseType) {
        const words = this.wordref.words[declension.toString()];
        if (!words || words.length === 0) return null;

        const word = words[Math.floor(Math.random() * words.length)];
        const ending = this.getEnding(declension, number, caseType, word.gender, word.type);
        if (ending === null) return null;

        let displayWord = word.word;
        if (declension === 3 && (caseType === 'Nominative' || caseType === 'Vocative') && word.nom) {
            displayWord = word.nom;
        }

        const wordWithEnding = ending ? displayWord + ending : displayWord;
        const correctAnswer = this.formatQuestionText(declension, number, caseType, word.gender, word.type);
        const options = this.generateDeclensionOptions(correctAnswer);
        
        return {
            question: wordWithEnding,
            correctAnswer: correctAnswer,
            options: options,
            declension,
            number,
            case: caseType,
            word: word
        };
    }

    getEnding(declension, number, caseType, gender = null, type = null) {
        const decl = this.wordref.declensions[declension.toString()];
        if (!decl) return null;

        try {
            switch (declension) {
                case 1:
                    return decl[number] && decl[number][caseType] !== undefined ? decl[number][caseType] : null;
                case 2:
                    const genderKey = gender || 'Masculine';
                    return decl[number] && decl[number][genderKey] && decl[number][genderKey][caseType] !== undefined 
                        ? decl[number][genderKey][caseType] : null;
                case 3:
                    const typeKey = type || 'Pure';
                    const genderKey3 = gender || 'Masculine';
                    return decl[typeKey] && decl[typeKey][number] && decl[typeKey][number][genderKey3] 
                        && decl[typeKey][number][genderKey3][caseType] !== undefined 
                        ? decl[typeKey][number][genderKey3][caseType] : null;
                case 4:
                    const typeKey4 = type || 'us';
                    return decl[typeKey4] && decl[typeKey4][number] && decl[typeKey4][number][caseType] !== undefined 
                        ? decl[typeKey4][number][caseType] : null;
                case 5:
                    const typeKey5 = type || 'ies';
                    return decl[typeKey5] && decl[typeKey5][number] && decl[typeKey5][number][caseType] !== undefined 
                        ? decl[typeKey5][number][caseType] : null;
                default:
                    return null;
            }
        } catch (error) {
            console.error('Error getting ending:', error);
            return null;
        }
    }

    formatQuestionText(declension, number, caseType, gender = null, type = null) {
        let text = `${declension}${this.getOrdinalSuffix(declension)} Declension, ${number}, ${caseType}`;
        
        if (declension === 2 && gender) {
            text += `, ${gender}`;
        }
        
        if (declension === 3 && gender && type) {
            text += `, ${gender}, ${type}`;
        }
        
        if (declension === 4 && type) {
            text += `, -${type} ending`;
        }
        
        if (declension === 5 && type) {
            text += `, -${type} ending`;
        }
        
        return text;
    }

    getOrdinalSuffix(num) {
        const suffixes = ['', 'st', 'nd', 'rd', 'th', 'th'];
        return suffixes[num] || 'th';
    }

    generateEndingOptions(correctEnding, declension, number, caseType) {
        const options = new Set([correctEnding]);
        
        // Add some random endings from selected declensions/cases only
        for (const selectedDeclension of this.settings.declensions) {
            for (const num of ['Singular', 'Plural']) {
                for (const case_ of this.settings.cases) {
                    if (options.size >= 6) break;
                    // Get random gender/type for consistent option generation
                    const optionGender = this.getRandomGender(selectedDeclension);
                    const optionType = this.getRandomType(selectedDeclension);
                    const ending = this.getEnding(selectedDeclension, num, case_, optionGender, optionType);
                    if (ending !== null && ending !== correctEnding) {
                        options.add(ending);
                    }
                }
            }
        }
        
        // Convert to array and shuffle, then take first 3
        const optionsArray = Array.from(options).slice(0, 3);
        return this.shuffleArray(optionsArray);
    }

    generateDeclensionOptions(correctAnswer, avoidEnding = null) {
        const options = new Set([correctAnswer]);
        
        // Generate some incorrect options from selected declensions only
        for (const selectedDeclension of this.settings.declensions) {
            for (const num of ['Singular', 'Plural']) {
                for (const case_ of this.settings.cases) {
                    if (options.size >= 3) break;
                    
                    // Get random gender/type for consistent option generation
                    const optionGender = this.getRandomGender(selectedDeclension);
                    const optionType = this.getRandomType(selectedDeclension);
                    const optionText = this.formatQuestionText(selectedDeclension, num, case_, optionGender, optionType);
                    if (optionText !== correctAnswer) {
                        // If we have an ending to avoid, check it doesn't match
                        if (!avoidEnding || this.getEnding(selectedDeclension, num, case_, optionGender, optionType) !== avoidEnding) {
                            options.add(optionText);
                        }
                    }
                }
            }
        }
        
        const optionsArray = Array.from(options).slice(0, 3);
        return this.shuffleArray(optionsArray);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Helper functions for storing quiz results
export function saveQuizResult(result) {
    const results = getQuizResults();
    results.push({
        ...result,
        date: new Date().toISOString(),
        quizid: results.length
    });
    localStorage.setItem('quizResults', JSON.stringify(results));
}

export function getQuizResults() {
    if (typeof window === 'undefined') return [];
    const results = localStorage.getItem('quizResults');
    return results ? JSON.parse(results) : [];
}

export function clearQuizResults() {
    localStorage.removeItem('quizResults');
}
