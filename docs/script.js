// Ethan Bao
// CPSC 332
// Dr. Olivares
// HW5
// 11/07/2022
var color1 = "#0095DD";

window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -2;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var lives = 3;
    var optionsContainer = document.getElementById("options-container")
    var pauseButton = document.getElementById("pauseButton");
    var speedSliderLabel = document.getElementById("speedSliderLabel");
    var speedSlider = document.getElementById("speedSlider");
    var newGameButton = document.getElementById("newGameButton");
    var continuePlayingButton = document.getElementById("continuePlayingButton");
    var reloadButton= document.getElementById("reloadButton");
    var highScore = 0;
    var speed = 1;
    var pause = false;
    var bricks = [];
    var loss = false;

    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        }
        else if (e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        }
        else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount) {
                            checkWinState();
                            loss = false;
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "purple";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Score: " + score, 60, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawHighScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if (lives <= 0) {
                    checkWinState();
                    loss = true;
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx * speed;
        y += dy * speed;

        if(!pause) {
            requestAnimationFrame(draw);
        }
    }

    /*
        Additions to starter code
    */

    //Additional variables used to help make dimensions/locations easier to reuse            
    //controls game speed            
    //pause game variable            
    //high score tracking variables
    //other variables?            

    //event listeners added
    //game speed changes handler            
    //pause game event handler            
    //start a new game event handler            
    //continue playing
    //reload click event listener            
    //Drawing a high score
    function drawHighScore() {
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Highscore: " + highScore, 200, 20);
    }

    //draw the menu screen, including labels and button
    function drawMenu() {
        //draw the rectangle menu backdrop
        var startMenu = document.createElement("div");
        startMenu.id = "startMenu";
        startMenu.className = "startMenu";
        startMenu.innerText = "Breakout Game!";
        startMenu.style.position = "absolute";
        var startButton = document.createElement("button");
        startButton.id = "startButton";
        startButton.className = "btn";
        startButton.innerText = "Start Game";
        startMenu.appendChild(startButton);
        // insertAfter(startMenu, canvas);
        // canvas.prepend(startMenu);
        document.body.insertBefore(startMenu, canvas);
        // document.body.insertAdjacentElement(startMenu, canvas);
        
        //draw the menu header

        //start game button area

        //event listener for clicking start
        startButton.addEventListener("click", startGameClick);
        //need to add it here because the menu should be able to come back after 
        //we remove the it later                
    }

    //function used to set shadow properties
    function setShadow() {
        const startbtn = document.getElementById("startButton");
        if(element != null) {
            startbtn.style.boxShadow = "10px 20px 30px black";
        }
    };

    //function used to reset shadow properties to 'normal'
    function resetShadow() {
        const startbtn = document.getElementById("startButton");
    };

    //function to clear the menu when we want to start the game
    function clearMenu() {
        //remove event listener for menu, 
        //we don't want to trigger the start game click event during a game
        const element = document.getElementById("startMenu");
        if(element != null) {
            element.parentNode.removeChild(element);
        }               
    }

    //function to start the game
    //this should check to see if the player clicked the button
    //i.e., did the user click in the bounds of where the button is drawn
    //if so, we want to trigger the draw(); function to start our game
    
    function startGameClick(event) {
        clearMenu();
        draw();
    };

    //function to handle game speed adjustments when we move our slider
    
    speedSlider.oninput = function adjustGameSpeed() {
        //update the slider display
        speedSliderLabel.innerText = "Game Speed: " + this.value;                
        //update the game speed multiplier
        speed = this.value;                
    };

    //function to toggle the play/paused game state
    pauseButton.addEventListener("click", togglePauseGame);
    function togglePauseGame() {
        //toggle state
        if(pause) {
            pause = false;
            draw();
        }
        else {
            pause = true;
        }               
        //if we are not paused, we want to continue animating (hint: zyBook 8.9)
    };

    //function to check win state
    //if we win, we want to accumulate high score and draw a message to the canvas
    //if we lose, we want to draw a losing message to the canvas
    function checkWinState() {
        var message = document.createElement("div");
        message.id = "message";
        message.style.position = "absolute";
        message.style.fontSize = "35px";
        if(lives <= 0) {
            //display message
            message.innerText = "You Lost! Game Over!"
            message.style.color = "red";
            document.body.insertBefore(message, canvas);
            togglePauseGame();
        }
        if (score == brickRowCount * brickColumnCount) {
            //display message
            message.innerText = "You Win! Congratulations"
            message.style.color = "blue";
            document.body.insertAfter(message, canvas);
            highScore += score;
            togglePauseGame();
        }
    };

    //function to clear the board state and start a new game (no high score accumulation)
    newGameButton.addEventListener("click", startNewGame);
    function startNewGame(resetScore) {
        const element = document.getElementById("message");
        if(element != null) {
            element.parentNode.removeChild(element);
        }
        highScore = 0;
        score = 0;
        lives = 3;
        speedSlider.value = 1;
        speedSliderLabel.innerText = "Game Speed: 1"; 
        for (var c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        speed = 1;
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
        pause = true;
        draw();
    };

    //function to reset the board and continue playing (accumulate high score)
    //should make sure we didn't lose before accumulating high score
    continuePlayingButton.addEventListener("click", continuePlaying);
    function continuePlaying() {
        const element = document.getElementById("message");
        if(element != null) {
            element.parentNode.removeChild(element);
        }
        if(loss) {
            lives = 3;
            loss = false;
        }
        score = 0;
        for (var c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        x = canvas.width / 2;
        y = canvas.height - 30;
        paddleX = (canvas.width - paddleWidth) / 2;
        pause = true;
        draw();
    };

    //function to reset starting game info
    reloadButton.addEventListener("click", resetBoard);
    function resetBoard(resetLives) {
        highScore = 0;
        lives = 3;
        document.location.reload();
        
    };

    //draw the menu.
    drawMenu();

    //we don't want to immediately draw... only when we click start game            
    // draw();

};//end window.onload function