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

//Setting initial game variables
var quizRunning = false;
var acceptingAnswers = false;
var score = 0;
var currQuestionIndex = 0;
var totalQuestions;
var currQuestion;

// <tr>
//       <th scope="row">1</th>
//       <td>Mark</td>
//       <td>Otto</td>
//       <td>@mdo</td>
//     </tr>

//Fn declarations

addHighScore = (name, score, date) => {
    var scoreEntry = {
        name: name,
        score: score,
        date: date
    }

    var highScoresObj = localStorage.getItem("scores");

    if(highScoresObj){
        highScoresObj = JSON.parse(highScoresObj);
    } else {
        highScoresObj = [];
    }

    highScoresObj.push(scoreEntry);

    highScoresObj = JSON.stringify(highScoresObj);

    localStorage.setItem("scores", highScoresObj);

}

//Fn to fill HS table
fillHighscores = () => {

    while(highscoreTable.childElementCount){
        highscoreTable.removeChild(highscoreTable.childNodes[0]);
    }

    var highScoresObj = localStorage.getItem("scores");
    if(highScoresObj){
        highScoresObj = JSON.parse(highScoresObj);

        highScoresObj.sort((a, b) => {return b.score - a.score});
        
        highScoresObj.forEach((entry, i) => {
            var tableRow = document.createElement("tr");
            
            var tableRowH = document.createElement("th");
            tableRowH.setAttribute("scope", "row");
            tableRowH.innerText = i + 1;
            tableRow.appendChild(tableRowH);

            var tableRowName = document.createElement("td");
            tableRowName.innerText = entry.name;
            tableRow.appendChild(tableRowName);

            var tableRowScore = document.createElement("td");
            tableRowScore.innerText = entry.score;
            tableRow.appendChild(tableRowScore);

            var tableRowDate = document.createElement("td");
            tableRowDate.innerText = entry.date;
            tableRow.appendChild(tableRowDate);

            highscoreTable.appendChild(tableRow);
        });
    }
}

//Button handler fn
buttonHandler = (event) => {

    if (acceptingAnswers) {
        acceptingAnswers = false;

        var userChoice = +event.target.dataset.option;
        var correctAnswerBut = document.querySelector(`.choice-btn[data-option=\"${currQuestion.correctAnswer}\"]`);

        console.log(correctAnswerBut);

        console.log(userChoice);
        if (userChoice === currQuestion.correctAnswer) {

            correctAnswerBut.classList.toggle("btn-primary");
            correctAnswerBut.classList.toggle("btn-success");
            score = score + currQuestion.points;

        } else {
            quizTimer.penalty(10);
            event.target.classList.toggle("btn-primary");
            event.target.classList.toggle("btn-danger");

            correctAnswerBut.classList.toggle("btn-primary");
            correctAnswerBut.classList.toggle("btn-success");
            
            //highlight right answer
            console.log("Wrong");
        }
        setTimeout(fillNextQuestion, 1000);

    }
}

//Function to fill page elements from question array
fillNextQuestion = () => {
    if (currQuestionIndex >= totalQuestions) {
        //if trying to advance past questions available trigger endgame
        endGame();


        console.log("Finished!");
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

        
        acceptingAnswers = true;

        //Increment curr question for next call
        currQuestionIndex++;
    }
}

endGame = () => {
    var timeRemaining = quizTimer.currSecs;
    quizTimer.stop();

    
    duringQuizEl.classList.add("hidden");
    afterQuizEl.classList.remove("hidden");
    scoreModal.classList.remove("hidden");
    

    //Calculate score


}


//End Fn declarations


fillHighscores();

//quiz timer object
var quizTimer = {
    startSecs: 60,
    currSecs: 60,
    increment: 1000,
    timerRunning: false,
    start: function () {
        this.timerRunning = true;
        var intervalFn = setInterval(() => {
            if (this.timerRunning) {
                if (this.currSecs <= 0) {
                    this.timerRunning = false;
                    //Trigger endgame
                }
                this.display();
                this.currSecs -= 1;
            } else {
                clearInterval(intervalFn);
            }
        }, this.increment)
    },
    stop: function () {
        this.timerRunning = false;
    },
    reset: function () {
        this.currSecs = this.startSecs;
        this.display();
    },
    display: function () {
        timerSeconds.innerText = this.currSecs;
    },
    penalty: function (penalty) {
        this.currSecs = this.currSecs >= penalty
            ? this.currSecs - penalty
            : 0;
        this.display();
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

highscoreBtn.addEventListener("click", (event) => {
    quizBeforeStartEl.classList.add("hidden");
    afterQuizEl.classList.remove("hidden");
});