(function() {
	var questions = [{
		question: "What is the distance AC?",
		image: "images/question4.png",
		choices: ["words", " 9.90km ", " 9.28km ", " 6.24km ", " 7.08km "],
		correctAnswer: 4,
		type: 0,
		tips: "First step is to draw the diagram. Remember: Bearings are taken from the north vertical and run clockwise. IN order to find the length, we need an angle. "
	},{
    question: "What is the bearing of A from C?",
    image: "images/question4.png",
    choices: ["words", " 68.4° ", " 168.4° ", " 148.4° ", " 191.6° "],
    correctAnswer: 2,
    type: 0,
    tips: "To find the bearing we must find angl NCA. Using the theory of similar triangles, we can deduce that angle BCS is 80°. In order to find angle BCAwe need to use the sine rule as we require a second angle."
  },{
    question: "What is the area of triangle ABC?",
    image: "images/question4.png",
    choices: ["words", " 14.3km²  ", " 12.2km² ", " 16.4km² ", " 9.90km² "],
    correctAnswer: 3,
    type: 0,
    tips: "Using similar angles."
  }];

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
  document.getElementById("lesson-progress").valuemax = (questions.length - (incorrect.length-1));

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
        document.getElementById("lesson-progress").valuemax = (questions.length - (incorrect.length-1));
      	document.getElementById("lesson-progress").style = "width:" + (progress / (questions.length - (incorrect.length-1)) * 100) + "%";
        correct = true;
      }else{
   		 incorrect[questionCounter] = +$('input[name="answer"]:checked').val();
      	//display correct answer
      	document.getElementById("tick-cross").src = "images/cross2.png";
      	document.getElementById("outcome").innerHTML = "Correct solution:";
        document.getElementById("lesson-progress").valuemax = (questions.length - (incorrect.length-1));
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