class PointsHandler {
    constructor(ducksNumber) {
        this.ducksNumber = ducksNumber;
        this.loadUserData();
        this.connectToWebSocket();
       // this.updateRanking(); // Llamar a la función para actualizar el ranking al iniciar
    }

    loadUserData() {
        var username = localStorage.getItem('username');
        if (!username) {
            console.error("Usuario no registrado.");
            return;
        }
        
        let userData = localStorage.getItem(username);
        if (userData) {
            let parsedData = JSON.parse(userData);
            this.pointsNumber = parsedData.pointsNumber || 0;
            this.level = parsedData.level || 0;
        } else {
            // Si no hay datos para este usuario, inicializarlos
            this.pointsNumber = 0;
            this.level = 0;
            this.saveUserData();
        }
    }

    saveUserData() {
        var username = localStorage.getItem('username');
        if (!username) {
            console.error("Usuario no registrado.");
            return;
        }
        
        let userData = {
            pointsNumber: this.pointsNumber + this.level, // Sumar el nivel al puntaje
            level: this.level
        };
        localStorage.setItem(username, JSON.stringify(userData));
    }

    connectToWebSocket() {
        // Establecer una conexión WebSocket
        this.socket = new WebSocket("wss://gamehubmanager.azurewebsites.net/ws");

        // Llamar al método para manejar los mensajes entrantes
        this.socket.onmessage = this.handleWebSocketMessage.bind(this);
    }

    handleWebSocketMessage(event) {
        // Parsear el mensaje JSON
        let data = JSON.parse(event.data);
        let rankingData = JSON.parse(data);
        
        console.log(typeof rankingData);
        console.log(rankingData);

        this.updateRanking2(rankingData);
        
        /*
        if (data.game === "DuckHunt") {
            if (data.event === "pointsNumber") {
                // Actualizar los puntos del jugador en el localStorage
                let username = data.player;
                let points = data.value;
                let userData = JSON.parse(localStorage.getItem(username)) || {};
                userData.pointsNumber = points;
                localStorage.setItem(username, JSON.stringify(userData));
            } else if (data.event === "level") {
                // Actualizar el nivel del jugador en el localStorage
                let username = data.player;
                let level = data.value;
                let userData = JSON.parse(localStorage.getItem(username)) || {};
                userData.level = level;
                localStorage.setItem(username, JSON.stringify(userData));
            }
            // Actualizar el ranking después de procesar los datos del WebSocket
            this.updateRanking();
        }
        */
    }

    sendDataToWebSocket(data) {
        // Verificar si la conexión WebSocket está abierta antes de enviar los datos
        if (this.socket.readyState === WebSocket.OPEN) {
            // Enviar los datos al servidor WebSocket
            var dataJson = JSON.stringify(data);
            console.log(dataJson);
            this.socket.send(dataJson);
        }
    }

    addPoints(successfulHits) {
        this.loadUserData(); // Cargar los datos del usuario antes de modificarlos
        if (successfulHits == 1) {
            this.pointsNumber += 10;
            this.displayUpdatedPointsNumber();
        } else if (successfulHits > 1) {
            this.pointsNumber += 20 * successfulHits;
            this.displayUpdatedPointsNumber();
        }
        this.saveUserData(); // Guardar los datos del usuario después de modificarlos
        // Enviar los datos actualizados al servidor WebSocket
        this.sendDataToWebSocket({ game: "DuckHunt", 
        player: localStorage.getItem('username'), 
        event: "pointsNumber", 
        value: this.pointsNumber });

        //this.updateRanking(); // Llamar a la función para actualizar el ranking después de añadir puntos
    }

    updateRanking2(rankingData){
        console.log('Rank...');
        console.log(rankingData);

        var rankingList = document.getElementById('rankingList');

        rankingList.innerHTML = '';
        
        rankingData.forEach((item, index) => {
            let listItem = document.createElement('li');
            listItem.textContent = (index + 1) + '° lugar: ' + item.Player + ' | Puntos: ' + item.Value;
            rankingList.appendChild(listItem);
        });
    }

    updateRanking() {
        // Obtener el elemento de la lista de ranking
        var rankingList = document.getElementById('rankingList');
        rankingList.innerHTML = ""; // Limpiar la lista antes de reconstruir

        // Obtener todos los usuarios del localStorage
        var users = Object.keys(localStorage);

        // Filtrar solo los usuarios que tienen datos de puntuación
        var usersWithData = users.filter(user => user !== 'username');

        // Obtener datos de puntuación de cada usuario y construir la lista de jugadores ordenados por puntaje
        var sortedUsers = usersWithData.sort((a, b) => {
            let userDataA = JSON.parse(localStorage.getItem(a));
            let userDataB = JSON.parse(localStorage.getItem(b));
            return (userDataB.pointsNumber - userDataA.pointsNumber); // Ordenar de mayor a menor puntaje
        });

        // Construir la lista de jugadores ordenados y enumerarlos
        sortedUsers.forEach((user, index) => {
            let userData = JSON.parse(localStorage.getItem(user));
            let listItem = document.createElement('li');
            listItem.textContent = (index + 1) + '° lugar: ' + user + ' | Puntos: ' + userData.pointsNumber;
            rankingList.appendChild(listItem);
        });
    }

    addLevel() {
        this.loadUserData(); // Cargar los datos del usuario antes de modificarlos
        this.level += 1;
        this.displayUpdatedLevelNumber();
        this.saveUserData(); // Guardar los datos del usuario después de modificarlos
        // Enviar los datos actualizados al servidor WebSocket
        this.sendDataToWebSocket({ game: "DuckHunt", 
        player: localStorage.getItem('username'), 
        event: "level", 
        value: this.level });
    }

    displayUpdatedLevelNumber() {
        $("#levelCount").html(this.level);
    }

    displayUpdatedPointsNumber() {
        $("#scoreCount").html(this.pointsNumber + this.level); // Actualizar también el puntaje mostrado en la pantalla
    }
}