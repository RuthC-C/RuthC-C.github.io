(function() {
	var questions = [{
		question: "Convert 50° to radians",
		image: "none",
		choices: ["words", " 5/18 rads ", " 18/5 rads ", " 18π/5rads ", " 5π/18 rads "],
		correctAnswer: 4,
		type: 0,
		tips: "To convert degrees into radians you need to multiply by: π/180°"
	},{
    question: "Convert 3π/2 to degrees",
    image: "none",
    choices: ["words", " 270° ", " 85.9° ", " 0.08° ", " 120° "],
    correctAnswer: 1,
    type: 0,
    tips: "To convert radians to degrees you need to multiply by: 180°/π"
  },{
    question: "Solve the equation sinθ = 0.5 for 0 ≤ θ ≤ 2π",
    image: "none",
    choices: ["words", " π/6, 11π/6 ", " 30 ", " π/6, 5π/6 ", " π/6 "],
    correctAnswer: 3,
    type: 0,
    tips: "There are 2 values within this rand. Drawing a graph and using the symmetry of the curve: θ = π - π/6."
  },];

//parse the json text in. ( can most likely shove everything at the top of this file though :P
 /* var request = new XMLHttpRequest();
  request.open('GET', 'questions.json', false);
  request.send(null);
  var questions = JSON.parse(request.responseText);*/

  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var incorrect = []; // Array containing the incorrect user choices
  var quiz = $('#quiz'); //Quiz div object
  var correct = true;
  var progress = 0;
  var checked = false;
  var user = profile('Ruth', 'Caulcott-Cooper', 4, 0);

  // Display initial question
  displayNext();
  document.getElementById("lesson-progress").valuemax = (questions.length - incorrect.length);

  // Click handler for the 'check' button
  $('#check').on('click', function(e) {
    e.preventDefault();

    // Suspend click listener during fade animation
    if (quiz.is(':animated')) {
      return false;
    }
    choose();

    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      alert('Please choose an answer!');
    } else {

      if (selections[questionCounter] === questions[questionCounter].correctAnswer) {
      	/*Put a tick on the left side in HTML*/
      	progress++;
      	document.getElementById("tick-cross").src = "images/tick.png";
      	document.getElementById("outcome").innerHTML = "You are correct";
      	document.getElementById("tick-cross-text").innerHTML = "";
      	document.getElementById("lesson-progress").valuenow = progress;
      	document.getElementById("lesson-progress").style = "width:" + (progress / (questions.length - incorrect.length) * 100) + "%";
        correct = true;
      }else{
   		 incorrect[questionCounter] = +$('input[name="answer"]:checked').val();
      	//display correct answer
      	document.getElementById("tick-cross").src = "images/cross2.png";
      	document.getElementById("outcome").innerHTML = "Correct solution:";
      	document.getElementById("tick-cross-text").innerHTML = questions[questionCounter].choices[(questions[questionCounter].correctAnswer)];
      	questions.push(questions[questionCounter]);
      	//questions.splice(questionCounter, 1);
      	correct = false;
      }
      checked = true;
      displayAnswer(correct);
      $('#check').hide();
      $('#next').show();
      $('#checked').show();
    }
  });


  // Click handler for the 'next' button
  $('#next').on('click', function(e) {
    e.preventDefault();	

    // Suspend click listener during fade animation
    if (quiz.is(':animated')) {
      return false;
    }
    choose();
    checked = false;
  	questionCounter++;
    $('#checked').hide();
    $('#next').hide(); 
    displayNext();
  });

  // Click handler for the 'Start Over' button
  $('#start').on('click', function(e) {
    e.preventDefault();
    progress =0;
  	document.getElementById("lesson-progress").style = "width:" + ((progress / (questions.length - incorrect.length)) * 100) + "%";

    if (quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $('#start').hide();
  });


  // Click handler for the 'Finish' button
  $('#finish').on('click', function(e) {
    e.preventDefault();

    if (quiz.is(':animated')) {
      return false;
    }
    window.location = "learn.html";
    $('#finish').hide();
  });

  $('#quit-button').on('click', function(e) {
  		if(confirm('Are you sure you want to quit? All progress in this session will be lost.') === true){
  			document.getElementById('quit-button').href = "learn.html";
  		} else {
  			document.getElementById('quit-button').href = "#";
  		}

  });

  // Creates and returns the div that contains the questions and 
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });

    var question = $('<h4>').append(questions[index].question);
    qElement.append(question);

    var radioButtons = createRadios(index);
    qElement.append(radioButtons);

    return qElement;
  }

  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
	var options = $('<div>', {
		id: 'options'
	});
	//change tips and notes to include information on this question:
	var myElement = document.getElementById("hints");
	var dataVal = myElement.getAttribute("data-content");
	var newData = questions[index].tips;
	myElement.setAttribute("data-content", newData);
	var picture = $('<img id = qImage src =' + questions[index].image + '>');
	
	options.append(picture);
	
    var radioList = $('<ul>');
    var item;
    var theLabel;
    var input = '';
    var imageInput = '';
    for (var i = 1; i < questions[index].choices.length; i++) {
      item = $('<li>');
      theLabel = $('<label>');
	  input = '<input type="radio" id="radioB" name="answer" value=' + i + ' />';
	  input += questions[index].choices[i];
	  theLabel.append(input);
      item.append(theLabel);
      radioList.append(item);
    }
    if(questions[index].image === 'none'){
		$(picture).hide();
	}
	options.append(radioList);
	
    //return radioList;
	return options;
  }

  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }

  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {

    	if(checked === false){
	      $('#question').remove();

	      if (questionCounter < questions.length) {
	        var nextQuestion = createQuestionElement(questionCounter);
	        quiz.append(nextQuestion).fadeIn();
	        if (!(isNaN(selections[questionCounter]))) {
	          $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
	        }

	        $('#check').show();
		    $('#finish').hide();
		    $('#start').hide();
	      } else {
	        var scoreElem = displayScore();
	        quiz.append(scoreElem).fadeIn();
	        $('#next').hide();
	        $('#start').show();
	        $('#finish').show();
	      }	

        } else {

        	$('#next').show();
        }
    });
  }

  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
    var score = $('<p>', {
      id: 'question'
    });

    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctAnswer) {
        numCorrect++;
      }
    }
	
	var expEarned = 20;
	var exp = addExp(expEarned);
    /*score.append('You got ' + numCorrect + ' questions out of ' +
      questions.length + ' right');*/
	  score.append('Congratulations! You have earned ' + getExp() + ' level experience and ' + getDailyExp() + ' daily Exp.' + '\n Your level: ' + getLevel());
    return score;
  }

  // displays the correct answer
  function displayAnswer(outcome){
  	var answer = $('<p>', {
  		id: 'question'
  	});

  	if(outcome === true){
  		answer.append('You are correct');
  	}else if (outcome === false){
  		answer.append('The correct answer is ' + questions[questionCounter].correctAnswer);

  	}
  	return answer;
  }

/*document.getElementById("lesson-progress").innerHTML = "<div class=progress-bar progress-bar-info progress-bar-striped role=progressbar aria-valuenow=" + lessonProgress() + " aria-valuemin=0 aria-valuemax=" + questions.length + " style=width:" + lessonProgress() + "%;> <span class=sr-only>" + lessonProgress() + "%</span></div>";*/

$(function () {
  $('#hints').popover();
});

})();