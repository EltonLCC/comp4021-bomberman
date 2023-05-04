const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;
    let _playerID = null;
    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };
    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();
        // Wait for the socket to connect successfully

        // Set up the movement event
        socket.on("move", (data) => {
            game.move(data.playerID, data.movement, data.direction);
        });


        // Set up the join game event
        socket.on("join game", (data) => {
            //left join button
            if (data.playerID == 0) {
                $("#join-player1").html(data.playerName);
                $("#join-player1").css("background", "blue");
            }
            //right join button
            if (data.playerID == 1) {
                $("#join-player2").html(data.playerName);
                $("#join-player2").css("background", "blue");
            }

            //when left & right buttons are pressed by player, the game start
            if ($("#join-player1").html() != "Player 1 Click this to join" && $("#join-player2").html() != "Player 2 Click this to join") {
                $("#game-canvas").css('opacity', '1');
                $("#waitingText").html("Game Start!");
                UI.startGame();
                game.start();
            }
        });

        socket.on("end game", (winner) => {
            $("#game-canvas").css('opacity', '0.1');
            $("#waitingText").html(winner + " win the game!");
            // disable all onclick listener
            $(document).unbind();
            getLeaderboard();
            UI.endGame(); // TODO: pass in arguments for showing the game stat after end game
        });

        socket.on("restart", () => {
            location.reload();
        });

        // TODO : create a leaderboard with below data
        socket.on("get leaderboard", (leaderboard) => {
            console.log("Leaderboard: " + leaderboard);
        });

    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    // post movement to server (called by game.js)
    const postMovement = function(movement, direction) {
        socket.emit("move", { playerID: _playerID, movement: movement, direction: direction });
    }

    // post player data to server (called by ui.js)
    const joinGame = function(playerName, playerID) {
        _playerID = playerID
        socket.emit("join game", { playerName: playerName, playerID: playerID });
    }

    // post the winner player name to server
    const endGame = function(playerName) {
        socket.emit("end game", playerName);
    }

    const restartGame = function() {
        socket.emit("restart", true);
    }

    // get all players rank
    const getLeaderboard = function() {
        socket.emit("get leaderboard", true);
    }

    return { getSocket, connect, disconnect, postMessage, postMovement, joinGame, endGame, restartGame, getLeaderboard };
})();