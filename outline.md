# Frameworks:

- Next.js
- Netlify
- Material UI
- Prisma

# Overview

This is a simple latin declension quiz app, each quiz is 20 questions, all Data for generating the Quizes is contained in data/wordref.json

The Quiz consists of 3 formats:

Format 1:
    Questions:
        1st Declension, {number}, {case}.
        2nd Declension, {number}, {case}, {gender}.
        3rd Declension, {number}, {case}, {gender}, {type}.
        4th Declension, {number}, {case}, -{type} ending.
        5th Declension, {number}, {case}, -{type} ending.
    3 Options:
        -a  -ae -ibus
    
    While some declension endings are the same across cases, such overlaps are not displayed, for example if the question is:
    1st Declension, Singular, Genitive.
    The options would only contain "-ae" as an option once.

Format 2:
    Question:
        What declension has the ending: -{ending}

    3 Options:
        1st Declension, {number}, {case}.
        2nd Declension, {number}, {case}, {gender}.
        3rd Declension, {number}, {case}, {gender}, {type}.
        4th Declension, {number}, {case}, -{type} ending.
        5th Declension, {number}, {case}, -{type} ending.

    Again, we do not display an option that has an overlap with other cases, so if the question is:
    What declension has the  ending: -a
    We do not display two options that both have the -a ending.

Format 3:
    Question:
        {word}{ending}

    3 Options:
        1st Declension, {number}, {case}.
        2nd Declension, {number}, {case}, {gender}.
        3rd Declension, {number}, {case}, {gender}, {type}.
        4th Declension, {number}, {case}, -{type} ending.
        5th Declension, {number}, {case}, -{type} ending.

    No overlap options are displayed, 3rd Declension words use {nom} for the Nominative and Vocative case instead of {word}.

# UI

We display a quiz start page, where the user selects the declensions they wish to pratice: 1st, 2nd, 3rd, 4th, 5th. 1st is selected by default.  

They then select the cases they wish to practice: Nominative, Vocative, Accusative, Genitive, Dative, Ablative, Locative.  Nominative, Accusative, Genitive, Dative, and Ablative are selected by default.

They then select the Quiz length they want, 5, 10 or 20.

Results of the quiz are stored as: 
userid: number
date: time
quizid: number // increments from 0
question type: 1-3
declension: 1-5
number: 1-2
case: 1-7
gender: 0-3
type: 0-2
answer: 0-1

Gender Index: [None, Masculine, Feminine, Neuter]
Type Index: [None, (Pure|us|ies), (mixed|u|es)]
Number index: [Singular, Plural]
Case index: [Nominative, Vocative, Accusative, Genitive, Dative, Ablative, Locative]

Results are stored locally for the user, using LocalStorage unless they are create an account.

After a quiz the user is shown their results in the form of a percentage, and the questions they got wrong.  With the option to take another quiz with the same settings or return to the start page.

The user's login status is displayed on the start page, If the user has not signed in or created an acount, there is an option to do so.


