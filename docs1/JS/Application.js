var startScreen = new StartScreen();

function launchApplication() {

        
        let gameStartCount = localStorage.getItem('gameStartCount') || 0;
        gameStartCount++;
        localStorage.setItem('gameStartCount', gameStartCount);

    let gameParameters = startScreen.getGameParametersFromUserSelect();
    let selectedModeName = gameParameters.modeName;
    let selectedMode;

    if (selectedModeName == "EXTREME") {
        selectedMode = new ExtremeGame(gameParameters);
    }
    else if(selectedModeName == "MODERN"){
        selectedMode = new ModernGame(gameParameters);
    }
    else{
        selectedMode = new ClassicGame(gameParameters);
    }

    startScreen.hideStartScreen();
    selectedMode.startGame();
}