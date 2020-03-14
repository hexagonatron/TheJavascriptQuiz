//Selecting page elements
var quizBeforeStartEl = document.querySelector(".before-game-start");
var duringQuizEl = document.querySelector(".during-quiz");
var questionTitle = document.querySelector(".question-title");
var questionText = document.querySelector(".question-text");
var questionAnswers = document.querySelector(".question-answers");

var timerSeconds = document.querySelector(".seconds");

//Selecting buttons
var highscoreBtn = document.querySelector(".highscores-btn");
var startQuizBtn = document.querySelector(".start-quiz-btn");

//Setting initial game variables
var quizRunning = false;
var score = 0;
var currQuestionIndex = 0;
var totalQuestions;
var currQuestion;

//Function to fill page elements from question array
fillNextQuestion = () => {
    if(currQuestionIndex >= totalQuestions){
        //if trying to advance past questions available trigger endgame
    } else {

        //hoist current question object to global scope
        currQuestion = questionArray[currQuestionIndex];

        //fill page elements
        questionTitle.innerText = currQuestion.name;
        questionText.innerText = currQuestion.question;

        //remove previous buttons
        while(questionAnswers.childElementCount){
            questionAnswers.removeChild(questionAnswers.childNodes[0]);
        }

        var choiceButArray = [];

        currQuestion.choices.forEach(choice => {
            var buttonDivEl = document.createElement("div");
            buttonDivEl.classList.add("col-12","col-sm-6","mb-2","px-1");

            var buttonEl = document.createElement("button");
            buttonEl.classList.add("btn","btn-primary","col-12");   
            buttonEl.dataset.option = choice.option;
            buttonEl.innerText = choice.choiceText;

            buttonDivEl.appendChild(buttonEl);

            choiceButArray.push(buttonDivEl);
        });

        while(choiceButArray.length > 0){
            var randIndex = Math.floor(Math.random() * choiceButArray.length);
            questionAnswers.appendChild(choiceButArray[randIndex]);
            choiceButArray.splice(randIndex, 1);
        }


        currQuestionIndex++;
    }
}

//quiz timer object
var quizTimer = {
    startSecs: 60,
    currSecs: 60,
    increment: 1000,
    timerRunning: false,
    start: function(){
        this.timerRunning = true;
        var intervalFn = setInterval(()=> {
            if(this.timerRunning){
                this.currSecs -= 1;
                this.display();
                if(this.currSecs <= 0){
                    this.timerRunning = false;
                }
            } else {
                clearInterval(intervalFn);
            }
        }, this.increment)
    },
    stop: function(){
        this.timerRunning = false;
    },
    reset: function(){
        this.currSecs = this.startSecs;
        this.display();
    },
    display: function(){
        timerSeconds.innerText = this.currSecs;
    }
}   

//Attaching event listeners to buttons
startQuizBtn.addEventListener("click", (event) => {
    //reset score to 0
    score = 0;
    currQuestionIndex = 0;
    totalQuestions = questionArray.length;
    quizBeforeStartEl.classList.add("hidden");

    //Countdown before start?

    quizTimer.start();
    quizRunning = true;

    fillNextQuestion();
    duringQuizEl.classList.remove("hidden");
    
});