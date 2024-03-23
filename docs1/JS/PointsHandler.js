class PointsHandler{

    constructor(ducksNumber){
        this.pointsNumber = 0;
        this.level = 0;
        this.ducksNumber = ducksNumber;
        this.loadLocalStorageData();
    }

    loadLocalStorageData() {
        this.pointsNumber = parseInt(localStorage.getItem('currentPoints')) || 0;
        this.level = parseInt(localStorage.getItem('currentLevel')) || 0;
    }

    saveDataToLocalStorage() {
        localStorage.setItem('currentPoints', this.pointsNumber);
        localStorage.setItem('currentLevel', this.level);
    }
    addPoints(successfulHits){
        if (successfulHits == 1) {
            this.pointsNumber += 10;
            this.displayUpdatedPointsNumber();
        }
        else if (successfulHits > 1){
            this.pointsNumber += 20 * successfulHits;
            this.displayUpdatedPointsNumber();
        }
        this.saveDataToLocalStorage(); 
    }

    addLevel(){
        this.level +=1;
        this.displayUpdatedLevelNumber();
        this.saveDataToLocalStorage(); 
    }

    displayUpdatedLevelNumber(){
        $("#levelCount").html(this.level);
    }

    displayUpdatedPointsNumber(){
        $("#scoreCount").html(this.pointsNumber);
    }


}