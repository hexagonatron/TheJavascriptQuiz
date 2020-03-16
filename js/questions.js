const questionArray = [
    {
        name: "Question 1",
        question: "Which of these is NOT a valid return value for the \"typeof\" operator?",
        choices: [
            {
                option: 1,
                choiceText: "'undefined'"
            },
            {
                option: 2,
                choiceText:"'function'"
            },
            {
                option: 3,
                choiceText: "'array'"
            },
            {
                option: 4,
                choiceText: "'object'"
            }
        ],
        correctAnswer: 3,
        points: 10
    },
    {
        name: "Question 2",
        question: "In Javascript, what would the value of the variable answer be in the following code snippit?\n<pre class=\"mt-3\">var answer = Infinity - Infinity;</pre>",
        choices: [
            {
                option: 1,
                choiceText: "0"
            },
            {
                option: 2,
                choiceText:"NaN"
            },
            {
                option: 3,
                choiceText: "Infinity"
            },
            {
                option: 4,
                choiceText: "undefined"
            }
        ],
        correctAnswer: 2,
        points: 10
    },
    {
        name: "Question 3",
        question: "In Javascript, what would the value of the variable answer be in the following code snippit?\n<pre class=\"mt-3\">var answer = typeof NaN;</pre>",
        choices: [
            {
                option: 1,
                choiceText: "'number'"
            },
            {
                option: 2,
                choiceText:"'string'"
            },
            {
                option: 3,
                choiceText: "'object'"
            },
            {
                option: 4,
                choiceText: "'undefined'"
            }
        ],
        correctAnswer: 1,
        points: 10
    },
    {
        name: "Question 4",
        question: "In Javascript, what would the value of the variable answer be in the following code snippit?\n<pre class=\"mt-3\">var answer = 011 + 1;</pre>",
        choices: [
            {
                option: 1,
                choiceText: "'0111'"
            },
            {
                option: 2,
                choiceText:"12"
            },
            {
                option: 3,
                choiceText: "10"
            },
            {
                option: 4,
                choiceText: "NaN"
            }
        ],
        correctAnswer: 3,
        points: 10
        
    },
    {
        name: "Question 5",
        question: "In Javascript, what would the value of the variable answer be in the following code snippit?\n<pre class=\"mt-3\">var answer = typeof 2.e-3;</pre>",
        choices: [
            {
                option: 1,
                choiceText: "'string'"
            },
            {
                option: 2,
                choiceText:"'number'"
            },
            {
                option: 3,
                choiceText: "'object'"
            },
            {
                option: 3,
                choiceText: "'NaN'"
            },
        ],
        correctAnswer: 2,
        points: 10
        
    },
];