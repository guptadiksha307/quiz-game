let correctAnswer,
   correctNumber=(localStorage.getItem('quiz_game_correct') ? localStorage.getItem('quiz_game_correct') : 0),
   incorrectNumber=(localStorage.getItem('quiz_game_incorrect') ? localStorage.getItem('quiz_game_incorrect') : 0);

document.addEventListener('DOMContentLoaded', function(){
    loadQuestions();

    eventListeners();
})

eventListeners=() => {
    document.querySelector('#correct-answer').addEventListener('click',validateAnswer);
    document.querySelector('#clear-storage').addEventListener('click',clearResults);
}

loadQuestions=() => {
    const url='https://opentdb.com/api.php?amount=1';
    fetch(url)
        .then(data => data.json())
        .then(result => displayQuestion(result.results));
}
//display questions into HTML from API
displayQuestion=questions =>{
    
    const questionHTML= document.createElement('div');
    questionHTML.classList.add('col-12');

    questions.forEach(question => {

       correctAnswer=question.correct_answer;
       //inject correct ans into possible answers

       let possibleAnswers= question.incorrect_answers;
       possibleAnswers.splice(Math.floor(Math.random() * 3),0,correctAnswer);

       //add teh HTML for the current question
       questionHTML.innerHTML=`
       <div class="row justify-content-between heading">
         <p class="category">Category:${question.category}</p>
         <div class="totals">
           <span class="badge badge-success">${correctNumber}</span>
           <span class="badge badge-danger">${incorrectNumber}</span>

         </div>
        </div>
       <h2 class="text-center">${question.question}</h2>
       `

       //generate the HTML for possible answers
       const answerDiv=document.createElement('div');
       answerDiv.classList.add('questions','row','justify-content-around','mt-4');
       possibleAnswers.forEach(answer => {
         
        const answerHTML=document.createElement('li');
        answerHTML.classList.add('col-12','col-md-5');
        answerHTML.textContent=answer;

        // attach the event when an answer is clicked
        answerHTML.onclick=selectAnswer;
        answerDiv.appendChild(answerHTML);
       });

       questionHTML.appendChild(answerDiv);
     //render in the HTML
      document.querySelector('#app').appendChild(questionHTML);

        
    });
}

selectAnswer=(e) => {
  
  //remove previous active class for the answer
  if(document.querySelector('.active'))
  {
      const activeAnswer=document.querySelector('.active');
      activeAnswer.classList.remove('active');
  }
  // adds the current answer
    e.target.classList.add('active');
}

//checks if the answer is correct and only 1 ans is selected

validateAnswer=() =>{
    
    if(document.querySelector('.questions .active'))
    {
        //everything is fine, check if ans is correct or not
       checkAnswer();

    }
    else
    {
        //error
        const errorDiv=document.createElement('div');
        errorDiv.classList.add('alert', 'alert-danger','col-md-6');
        errorDiv.textContent='Please select 1 answer';

        const questionDiv=document.querySelector('.questions');
        questionDiv.appendChild(errorDiv);

        //remove the erorr
        setTimeout(() => {
            document.querySelector('.alert-danger').remove();
        }, 3000);


    }
}

//check if ans is correct or not
checkAnswer=() =>
{
    const userAnswer=document.querySelector('.questions .active');
    if(userAnswer.textContent === correctAnswer)
    {
      correctNumber++;
    }
    else{
       incorrectNumber++;
    }

    //save into local storage
    saveIntoStorage();

   //clear previous HTML
   const app=document.querySelector('#app');
   while(app.firstChild){
       app.removeChild(app.firstChild);
   }
    //load a new question
    loadQuestions();
}

saveIntoStorage=() => {
    localStorage.setItem('quiz_game_correct', correctNumber);
    localStorage.setItem('quiz_game_incorrect',incorrectNumber);
}

// cleasr the results from storage

clearResults=()=>{

localStorage.setItem('quiz_game_correct', 0);
    localStorage.setItem('quiz_game_incorrect',0);
    setTimeout(() => {
        window.location.reload();
    },500);
}
