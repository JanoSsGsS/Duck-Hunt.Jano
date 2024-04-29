var startScreen = new StartScreen();

function launchApplication() {
       /* let gameStartCount = parseInt(localStorage.getItem('gameStartCount')) || 0;
    gameStartCount++;
    localStorage.setItem('gameStartCount', gameStartCount);*/

    // Obtener los parámetros del juego desde el inicio de pantalla
    let gameParameters = startScreen.getGameParametersFromUserSelect();
    let selectedModeName = gameParameters.modeName;
    let selectedMode;

    // Determinar el modo de juego seleccionado y crear una instancia correspondiente
    if (selectedModeName == "EXTREME") {
        selectedMode = new ExtremeGame(gameParameters);
    } else if (selectedModeName == "MODERN") {
        selectedMode = new ModernGame(gameParameters);
    } else {
        selectedMode = new ClassicGame(gameParameters);
    }

    // Ocultar la pantalla de inicio y comenzar el juego
    startScreen.hideStartScreen();
    selectedMode.startGame();

    // Conectar al servidor WebSocket
    // const socket = new WebSocket("wss://socketsbay.com/wss/v2/1/demo/");

    // Manejar eventos de apertura de la conexión WebSocket
    /*
    socket.addEventListener("open", function (event) {
        // Enviar datos al servidor una vez que la conexión esté abierta
        socket.send(JSON.stringify({
            eventType: "gameStart",
            gameStartCount: gameStartCount,
            selectedModeName: selectedModeName,
            gameParameters: gameParameters // Aquí podrías enviar más detalles sobre los parámetros del juego si es necesario
        }));
    });
    */
}