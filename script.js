// Selecting DOM elements
const startButton = document.querySelector('.start-game');
const cardDeck = document.querySelector('.deck');
const cardsInDeck = document.querySelector('.card');

// RESTART FUNCTION
function Restart(){
    startButton.style.display = "flex";                    
    cardsInDeck.style.display = "none";
}

// START FUNCTION
function start(){
    StartGame();
    startButton.style.display = "none";                    
    cardDeck.style.display = "flex";
}

// MIX
function mix(array) {
    var a = array.length, temp, b;                
    while (a !== 0) {
        b = Math.floor(Math.random() * a);
        a -= 1;
        temp = array[a];
        array[a] = array[b];
        array[b] = temp;
    }              
    return array;
}

// TOGGLE MODAL FUNCTION
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".close-button");              
function toggleModal() {
    modal.classList.toggle("show-modal");
}

// CLOSE MODAL ON CLICK OUTSIDE FUNCTION
function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();//call toggleModal function
    }
}

// Event listeners for close button and outside click
closeBtn.addEventListener("click", toggleModal);//clickBtn call toggleModal function
window.addEventListener("click", windowOnClick);//call windowOnclick function

// Array of cards and initializations
let cardArray = [];
let cards = ["diamond", "diamond", "plane", "plane", "anchor", "anchor", "bolt", "bolt", "leaf", "leaf", "bicycle", "bicycle", "cube", "cube", "bomb", "bomb"];//add fa-fa icons
let mixedCards = mix(cards);              
function createCards() {
    for (let card of mixedCards) {
        const li = document.createElement("LI");
        li.classList.toggle("card");
        const i = document.createElement("i");
        i.classList.toggle("fa");
        if (card === "plane") {
            i.classList.toggle("fa-paper-plane-o");
        } else {
            i.classList.toggle("fa-" + card);
        }
        const deck = document.querySelector('.deck');
        li.appendChild(i);
        deck.appendChild(li);              
    }
}

// Show answer cards for 2 seconds
function showAnswerCards() {
    const cards = document.querySelectorAll('.card');                
    cards.forEach(card => {
        if (!card.classList.contains('match')) { //no convert Skip the chosen cards                        
            card.classList.add('show');
        }
    },2000);
    // Hide answer cards after 2 seconds
    setTimeout(() => {
        cards.forEach(card => {
            if (!card.classList.contains('chosen') && !card.classList.contains('match')) { // no convert the chosen cards
                card.classList.remove('show');
            }                
        });
    }, 2000);
}            

// Game initialization function
const ul = document.querySelector('.deck');
let moves = document.querySelector(".moves");
let movesCounter = 0;
let stars = 3;
let match = 0;
let isfirstClick = true;
let timerID;
let isRestart = false;        
        
function StartGame() {                
    createCards();//call createCards function                
    const card = document.querySelectorAll('.card');
    for (let i = 0; i < card.length; i++) {
        card[i].classList.add('show'); // Show the cards
    }
    showAnswerCards();//call showAnswerCards function                
    setTimeout(() => {
        //convertCards();
        
    for (let i = 0; i < card.length; i++) {
        card[i].addEventListener("click", function (event) {
            if (card[i] !== event.target) return;//return true
            if (event.target.classList.contains("show")) return;//return true
            if (isfirstClick) {
                timerID = setInterval(timer, 1000);//1000 for 1 second
                isfirstClick = false;
            }
            showCards(event.target);//call showCards functions
            setTimeout(addCard, 550, mixedCards[i], event.target, cardArray, i);
        }, false);
    }
},2000);// Delay of 2 seconds (2000 milliseconds)
}

// Show a card
function showCards(card) {
    card.classList.add('show');              
}

// Add a card to the list for comparison
function addCard(card, cardHTML, testList, pos) {
    if (isRestart) {//check is Restart?
        testList.length = 0;
        isRestart = false;
    }
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
    testList.push(card);//(push)add value in array
    testList.push(cardHTML)//(push)add value in array
    testList.push(pos);//(push)add value in array
    if (testList.length === 6) {
        updateMoveCounter();//updateMoveCounter function
        testCards(testList[0], testList[1], testList[2], testList[3], testList[4], testList[5]);
        testList.length = 0;
    }
}

// Compare two cards
function testCards(firstcard, firsthtml, firstIndex, secondCard, secondhtml, secondIndex) {
    if (firstcard === secondCard && firstIndex != secondIndex) {
        cardsMatch(firsthtml, secondhtml);
    } else {
        cardsDontMatch(firsthtml, secondhtml);
    }
}

// Handle matching cards
function cardsMatch(firstcard, secondCard) {
    firstcard.classList.add('match');
    secondCard.classList.add('match');
    match++;
    if (match === 8) {
        win();//use win function
    }//cardsMatch function defined
}

// Handle non-matching cards
function cardsDontMatch(firstcard, secondCard) {
    firstcard.classList.toggle('no-match');
    secondCard.classList.toggle('no-match');
    setTimeout(function () {
        firstcard.classList.toggle('no-match');
        secondCard.classList.toggle('no-match');
        firstcard.classList.toggle('show');
        secondCard.classList.toggle('show');              
    }, 300);
}//cardsDontMatch function defined

// Handle winning the game
function win() {
    clearInterval(timerID);
    toggleModal();
    const stats = document.querySelector(".stats");
    if (s % 60 < 10) {
        stats.textContent = "You won with: " + stars + " stars in " + movesCounter + " moves with time: " + m + ":0" + s % 60;
    } else {
        stats.textContent = "You won with: " + stars + " stars in " + movesCounter + " moves with time: " + m + ":" + s % 60;
    }
}

// Update the move counter
function updateMoveCounter() {
    movesCounter++;
    moves.textContent = "Moves: " + movesCounter;
    if (movesCounter === 13) {
        let star = document.querySelector("#star3");
        star.classList.toggle("fa-star");
        star.classList.add("fa-star-o");
        stars--;
    } else if (movesCounter === 25) {
        let star = document.querySelector("#star2");
        star.classList.toggle("fa-star");
        star.classList.add("fa-star-o");
        stars--;
    } else if (movesCounter === 35) {
        let star = document.querySelector("#star1");
        star.classList.toggle("fa-star");
        star.classList.add("fa-star-o");
        stars--;
    }
}

// Timer function
let s = 0;
let m = 0;
function timer() {
    ++s;//seconds increasing
    //++s because I want to increase second before calculating minutes
    m = Math.floor(s / 60);//minutes
    let timer = document.querySelector(".timer");
    if (s % 60 < 10) {//if the seconds value is between 0 and 9, the seconds value with a leading zero added. e.g. Elapsed Time: 2:09.
        timer.textContent = "Elapsed Time: " + m + ":0" + s % 60;
    } else {
        timer.textContent = "Elapsed Time: " + m + ":" + s % 60;//else e.g. Elapsed Time: 2:10.
    }//that is why i use <10  
//%60 is for calculating minutes
}

// Restart the game
let restart = document.querySelector(".restart");
restart.addEventListener("click", restartGame, false);
function restartGame() {
    clearInterval(timerID);
    movesCounter = 0;
    match = 0;
    s = 0;
    m = 0;                
    isfirstClick = true;
    isRestart = true;
    const deck = document.querySelector('.deck');
    var elements = deck.getElementsByClassName("card");              
    while (elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
    }
    mixedCards = mix(cards);
    let timer = document.querySelector(".timer");
    timer.textContent = "Elapsed Time: 0:00";
    moves.textContent = "Moves: " + movesCounter;
    resetHints();
    resetStars();//call resetStars function
    Restart();
    StartGame();//call StartGame function
}

// Reset stars to initial state
function resetStars() {
    stars = 3;
    let star = document.querySelector("#star3");
    star.classList.remove("fa-star");
    star.classList.remove("fa-star-o");
    star.classList.add("fa-star");
    //star 3 changed into white star with black border
    star = document.querySelector("#star2");
    star.classList.remove("fa-star");
    star.classList.remove("fa-star-o");
    star.classList.add("fa-star");
    //star 2 changed into white star with black border
    star = document.querySelector("#star1");
    star.classList.remove("fa-star");
    star.classList.remove("fa-star-o");
    star.classList.add("fa-star");
    //star 1 changed into white star with black border
}

// New game button click handler
const newGameButton = document.querySelector(".new-game");
newGameButton.addEventListener("click", newGame);
function newGame() {
    toggleModal();//call toggleModal function
    restartGame();//call restartGame function
}              

// SHOW HINTS FUNCTION
let hintCount = 3;// Initialize the hint count
const hintsButton = document.querySelector('.show-hints');  
function ShowHints() {
    const cards = document.querySelectorAll('.card:not(.match)');              
    if (cards.length < 2) {
        return; // Do not proceed if there are less than two unmatched cards
    }                              
    let matchedCards = [];                                                        
        if(hintCount!==0){
            hintCount--;
            hintsButton.innerText = `${hintCount} Hints left`;
        }
        if(hintCount === 0) {
            hintsButton.innerText = 'No Hints Left';
            hintsButton.disabled = true;// Disable the button
        }                        
        cards.forEach(card => {
            const cardValue = card.querySelector('i').classList[1];
            const matchingCards = Array.from(cards).filter(c => c !== card && c.querySelector('i').classList[1] === cardValue);
            if (matchingCards.length > 0) {
                matchedCards.push(card);//push() add value to array
                matchedCards.push(matchingCards[0]);//0 room ka sa twin mr
            }                    
            if (matchedCards.length === 2) {//matchCards array of length must be 2 because i need two equal cards(matchedCards)
                matchedCards.forEach(matchedCard => matchedCard.classList.add('show', 'hints'));//add .show from css and .hints(oranged) from css
                return;
            }                    
    });
    setTimeout(() => {
        cards.forEach((card, index) => {
            if (!matchedCards.includes(index)) {
                card.classList.remove('show','hints');//remove .show from css and .match from css
            }
        });
        }, 1000);
    }

// Reset hint count
function resetHints() {
    hintCount = 3;
    const hintsButton = document.querySelector('.show-hints');
    if(hintCount === 0) {
        hintsButton.innerText = 'No Hints Left';
        hintsButton.disabled = true;// Disable the button
    }else{
        hintsButton.textContent = `${hintCount} Hints left`;
        hintsButton.disabled = false;
    }
}