const spacingFactor = 0.2
const drawLimit = 10


export function initialiseThreshold() {
    let drawThreshold
    if (!localStorage.getItem("drawThreshold")) {
        drawThreshold = 0
        localStorage.setItem("drawThreshold", drawThreshold);
    } else {
        drawThreshold = localStorage.getItem("drawThreshold")
    }
    return drawThreshold
}

let drawScores

export function initialiseDrawScores() {
    
    if (!localStorage.getItem("drawScores")) {
        drawScores = {}
        localStorage.setItem("drawScores", JSON.stringify(drawScores));
    } else {
        drawScores = JSON.parse(localStorage.getItem("drawScores"))
    }
    return drawScores
}


export function checkDrawScoreThreshold(word) {

    // If the word has no drawScore yet, initialise it
    if (!drawScores[word]) {
        drawScores[word] = 0;
        // Save the updated drawScores object back to localStorage
        localStorage.setItem('drawScores', JSON.stringify(drawScores));
        return true
    } else {
        return drawScores[word] <= drawThreshold
    }
    
}



export function updateDrawScore(word, hasBeenGuessed) {
    if (!drawScores[word]) {
        drawScores[word] = 0;
    }

    let drawScore = drawScores[word]

    if (hasBeenGuessed) {
        // xn+1​=xn​+(10−xn​)*r
        drawScore = drawScore + (drawLimit - drawScore) * spacingFactor
        drawScores[word] = Math.round(drawScore * 100) / 100
    } else {
        if (drawScore >= 1) {
            drawScores[word] -= 1
        } else {
            drawScores[word] = 0
        }
    }
    localStorage.setItem('drawScores', JSON.stringify(drawScores));
}




export function increaseDrawThreshold() {
    drawThreshold = drawThreshold + spacingFactor
    localStorage.setItem("drawThreshold", drawThreshold)
    return drawThreshold
}