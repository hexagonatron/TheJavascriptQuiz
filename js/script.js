//Selecting page elements
var quizBeforeStartEl = document.querySelector(".before-game-start");
var duringQuizEl = document.querySelector(".during-quiz");
var questionTitle = document.querySelector(".question-title");
var questionText = document.querySelector(".question-text");
var questionAnswers = document.querySelector(".question-answers");
var afterQuizEl = document.querySelector(".after-quiz");
var scoreModal = document.querySelector("score-modal");
var highscoreTable = document.querySelector(".highscore-table");

var timerSeconds = document.querySelector(".seconds");

//Selecting buttons
var highscoreBtn = document.querySelector(".highscores-btn");
var startQuizBtn = document.querySelector(".start-quiz-btn");
var playAgainBtn = document.querySelector(".play-again-btn");

//Setting initial game variables
var quizRunning = false;
var acceptingAnswers = false;
var score = 0;
var currQuestionIndex = 0;
var totalQuestions;
var currQuestion;

//Fn declarations

//Date string for highscores
getDateString = () => {
    //new date
    var timeNow = new Date;

    //formating
    var dateString = `${timeNow.getDate()}/${timeNow.getMonth() + 1}/${timeNow.getFullYear()}`;

    //returning
    return dateString;
}

//adds score to local storage
addHighScore = (name, score, date) => {

    //Score entry obj
    var scoreEntry = {
        name: name,
        score: score,
        date: date
    }

    //load current scores
    var highScoresObj = localStorage.getItem("scores");

    //If not present in local storage initilise empty array, if present then covert from string to object
    if (highScoresObj) {
        highScoresObj = JSON.parse(highScoresObj);
    } else {
        highScoresObj = [];
    }

    //push current entry to array
    highScoresObj.push(scoreEntry);

    //convert to string
    highScoresObj = JSON.stringify(highScoresObj);

    //push updated object to local storage
    localStorage.setItem("scores", highScoresObj);

}

//Fn to fill HS table
fillHighscores = () => {

    //removes all present highscores
    while (highscoreTable.childElementCount) {
        highscoreTable.removeChild(highscoreTable.childNodes[0]);
    }

    //gets scores from local storage
    var highScoresObj = localStorage.getItem("scores");

    //if there are scores in local storage
    if (highScoresObj) {

        //convert to obj
        highScoresObj = JSON.parse(highScoresObj);

        //sorts based on score
        highScoresObj.sort((a, b) => { return b.score - a.score });

        //for each score entry print to page
        highScoresObj.forEach((entry, i) => {

            //creates row entry
            var tableRow = document.createElement("tr");

            //creates rank entry, based on index of sorted array
            var tableRowH = document.createElement("th");
            tableRowH.setAttribute("scope", "row");
            tableRowH.innerText = i + 1;
            tableRow.appendChild(tableRowH);

            //Name item
            var tableRowName = document.createElement("td");
            tableRowName.innerText = entry.name;
            tableRow.appendChild(tableRowName);

            //Score item
            var tableRowScore = document.createElement("td");
            tableRowScore.innerText = entry.score;
            tableRow.appendChild(tableRowScore);

            //Date item
            var tableRowDate = document.createElement("td");
            tableRowDate.innerText = entry.date;
            tableRow.appendChild(tableRowDate);

            //Appends to page
            highscoreTable.appendChild(tableRow);
        });
    }
}

//Button handler fn
buttonHandler = (event) => {

    //if game is going on
    if (acceptingAnswers) {

        //stop accepting button pushes while processing
        acceptingAnswers = false;

        //get user choice as a number
        var userChoice = +event.target.dataset.option;

        //get correct answer from object array
        var correctAnswerBut = document.querySelector(`.choice-btn[data-option=\"${currQuestion.correctAnswer}\"]`);

        //if answer is correct
        if (userChoice === currQuestion.correctAnswer) {

            //change color of button to green
            correctAnswerBut.classList.toggle("btn-primary");
            correctAnswerBut.classList.toggle("btn-success");
            
            //add score to total score
            score = score + currQuestion.points;

        } else {
            //if user answer is wrong

            //Subtract 10 secs from timer
            quizTimer.penalty(10);

            //colour button to red
            event.target.classList.toggle("btn-primary");
            event.target.classList.toggle("btn-danger");

            //highlight correct answer
            correctAnswerBut.classList.toggle("btn-primary");
            correctAnswerBut.classList.toggle("btn-success");
        }

        // Fills next question after 1 second, to give a chance for color changes to register
        setTimeout(fillNextQuestion, 1000);

    }
}

//Function to fill page elements from question array
fillNextQuestion = () => {
    if (currQuestionIndex >= totalQuestions) {
        //if trying to advance past questions available trigger endgame
        endGame();

    } else {

        //hoist current question object to global scope
        currQuestion = questionArray[currQuestionIndex];

        //fill page elements
        questionTitle.innerText = currQuestion.name;
        questionText.innerText = currQuestion.question;

        //remove previous buttons
        while (questionAnswers.childElementCount) {
            questionAnswers.removeChild(questionAnswers.childNodes[0]);
        }

        //init el array
        var choiceButArray = [];

        //for each choice, create corresponding button
        currQuestion.choices.forEach(choice => {
            //container el
            var buttonDivEl = document.createElement("div");
            buttonDivEl.classList.add("col-12", "col-sm-6", "mb-2", "px-1");

            //button el
            var buttonEl = document.createElement("button");
            buttonEl.classList.add("btn", "btn-primary", "col-12", "choice-btn");

            //add on click handler
            buttonEl.addEventListener("click", buttonHandler);

            //Encodes choiceID to specific button   
            buttonEl.dataset.option = choice.option;
            buttonEl.innerText = choice.choiceText;

            //place button inside container
            buttonDivEl.appendChild(buttonEl);

            //push el to Array
            choiceButArray.push(buttonDivEl);
        });

        //randomly add an el to the page
        while (choiceButArray.length > 0) {
            var randIndex = Math.floor(Math.random() * choiceButArray.length);
            questionAnswers.appendChild(choiceButArray[randIndex]);
            choiceButArray.splice(randIndex, 1);
        }


        //game begins
        acceptingAnswers = true;

        //Increment curr question for next call
        currQuestionIndex++;
    }
}

//End game function
endGame = () => {

    //Get the remaining time and stop the timer
    var timeRemaining = quizTimer.currSecs;
    quizTimer.stop();

    //hide the quiz elements and show the highscore elements
    duringQuizEl.classList.add("hidden");
    afterQuizEl.classList.remove("hidden");
    //scoreModal.classList.remove("hidden");

    //calculates final score
    var finalScore = score + timeRemaining;

    //prompt for name to record in highscores
    var playerName = prompt(`Thanks for playing! Your score is:\nPoints from questions answered correctly: ${score} + Points for time remaining: ${timeRemaining}\nTotal: ${finalScore}\n\nPlease enter your name`);

    //adds score to scoreboard
    addHighScore(playerName, finalScore, getDateString());

    //fill page with highscores
    fillHighscores();

}

//On page load fill highscores
fillHighscores();

//quiz timer object
var quizTimer = {
    startSecs: 60,
    currSecs: 60,
    increment: 1000,
    timerRunning: false,

    //Start timer Fn
    start: function () {
        //set timer running to true
        this.timerRunning = true;

        //interval function to run until finish
        var intervalFn = setInterval(() => {

            //if the timer is running continue
            if (this.timerRunning) {

                //decrement
                this.currSecs -= 1;
                
                //Display on page
                this.display();

                //if reached 0 stop timer and call endgame fn
                if (this.currSecs <= 0) {
                    this.timerRunning = false;

                    //call end game events after small delay otherwise display isn't updated
                    setTimeout(endGame, 4);
                }
            } else {
                //if timer is not running clears interval
                clearInterval(intervalFn);
            }
        }, this.increment)
    },

    //stop timer function
    stop: function () {
        this.timerRunning = false;
    },

    //reset timer function
    reset: function (seconds) {
        this.startSecs = seconds;
        this.currSecs = this.startSecs;
        this.display();
    },

    //Fn to display secs to page
    display: function () {
        timerSeconds.innerText = this.currSecs;
    },

    //Penalise timer
    penalty: function (penalty) {

        //subtracts time from seconds, if less than 0 set timer to 0
        this.currSecs = this.currSecs >= penalty
            ? this.currSecs - penalty
            : 0;
        this.display();
    }
}

startGame = () => {
    //reset geme variables
    score = 0;
    currQuestionIndex = 0;
    totalQuestions = questionArray.length;
    timeAllowed = 15 * totalQuestions;

    //hide necessary elements
    quizBeforeStartEl.classList.add("hidden");
    afterQuizEl.classList.add("hidden");

    //Countdown before start?

    //reset timer and start it
    quizTimer.reset(timeAllowed);
    quizTimer.start();

    //Start accepting answers
    quizRunning = true;

    //fill next question and show the quiz
    fillNextQuestion();
    duringQuizEl.classList.remove("hidden");
}

//Attaching event listeners to buttons
startQuizBtn.addEventListener("click", (event) => {
    startGame();
});

highscoreBtn.addEventListener("click", (event) => {

    //show highscores, hide other things
    quizBeforeStartEl.classList.add("hidden");
    afterQuizEl.classList.remove("hidden");
});

playAgainBtn.addEventListener("click", e => {

    //Show page title, hide highscores 
    afterQuizEl.classList.add("hidden");
    quizBeforeStartEl.classList.remove("hidden");
})