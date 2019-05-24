$(function(){
	var allCards = [];
	var oneVisible = false;
	var turnCounter = 0;
	var firstCard = null;
	var firstNumber = undefined;
	var lock = false;
	var pairsLeft =  10;
	
	$('#start').on('click', startGame);
	
	function startGame(){
		getBoard();
		prepareCards();
		catchBoard();
	}
	
	function getBoard() {
		var startHTML = '';
		for(i = 0; i < 20; i++) {
			startHTML += '<div class="card" id="c'+i+'"></div> ';
		}

		startHTML+='<div class="score">Turn counter: 0</div>';
		startHTML+='<a class="link_border" href="index.html">Return</a>';
		$('.board').html(startHTML);	
	} 
		
	function prepareCards(){	
		var cards = [];
		for(var i = 0; i < 10; i++) {
			var name = 'card'+(i+1)+'.png';
			cards[i*2] = name;
			cards[i*2+1] = name;
		}

		var maxIndex = 19;

		for(var c = 0; c<cards.length; c++) {
			var index = Math.floor(Math.random() * maxIndex);
			allCards[c] = cards[index];
			cards[index] = cards[maxIndex];
			maxIndex--;	
		}
	}
	
	
	function catchBoard() {	
		$('.board').on('click', function(e) { revealCard(e); } );
	}

	function revealCard(e) {
		if(!$(e.target).hasClass('card')) {
			return;
		}

		if(lock) {
			return;
		}

		lock = true;
		$el = $(e.target);
		var opacityValue = $el.css('opacity');
		var nr = e.target.id.substring(1);
		var picture = 'url(images/' + allCards[nr] + ')';
		$el.css('background-image', picture);
		$el.toggleClass( 'cardA' );

		if(oneVisible == false) {
			oneVisible = true;
			firstCard = $el;
			firstNumber = nr;
			lock = false;
		} else {
			check2cards(firstNumber, nr, firstCard, $el);
		}
	}

	function check2cards(nr1, nr2, $card1, $card2) {
		if(nr1 == nr2) {
			lock = false;
			return;
		} else if(allCards[nr1] == allCards[nr2] ) {
			setTimeout(function() { hideCards($card1, $card2) }, 750);
		} else {
			setTimeout(function() { restoreCards($card1, $card2) }, 1000);
		}			

		turnCounter++;
		$('.score').html('Turn counter: ' + turnCounter);
		oneVisible = false;
	}

	function hideCards($card1, $card2) {
		$card1.css('opacity', '0');
		$card1.off('click');
		$card2.css('opacity', '0');
		$card2.off('click');

		pairsLeft--;

		if(pairsLeft == 0) 
		{
			win();
		}

		lock = false;
	}

	function restoreCards($card1, $card2) {
		$card1.css('background-image', 'url(images/card.png)');
		$card1.toggleClass( 'cardA' );

		$card2.css('background-image', 'url(images/card.png)');
		$card2.toggleClass( 'cardA' );
		lock = false;
	}

	function win() {	
	
			if(turnCounter <= 20) {
				var text ='<h1>You are the best!<br>Done in '+turnCounter+' turns</h1>';
			} else if(turnCounter <= 30) {
				var text ='<h1>Not bad!<br>Done in '+turnCounter+' turns</h1>';
			} else {
				var text ='<h1>Try again, youre sorce is bad!<br>Done in '+turnCounter+' turns</h1>';
			}
		var restartHTML = '<button class="button" id="restart">Restart</button>';
		$('.board').html(text);
		$('#record').html(restartHTML);
		$('#restart').on('click', startGame);
	}

}); 