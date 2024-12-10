const scoreDisplay = document.getElementById("score")
const topScoreDisplay = document.getElementById("high_score")
const frameDisplay = document.getElementById("frame")
const scoreCard = document.getElementById("score_card")
const frameEdit = document.getElementById("frame_num")
const frameScoreEdit = document.getElementById("frame_score")

let scoreTotal = 0
let highScore = 0

let cheater = false
let loser = false

var maxFrames = 20
var frames = []
var frameScores = []

const rollBall = () => {
    if (frames.length < maxFrames) {
        let score = 0
        if (cheater) {
            //Get a spare if you start cheating mid frame
            if (frames.length % 2 == 0) {
                score = 10
            }
            else {
                score = 10 - frames[frames.length - 1]
            }
        }
        else if (loser) {
            score = 0
        }
        else if (frames.length % 2 == 0) {
            score = getScore(10)
        }
        else {
            let lastScore = 10 - frames[frames.length - 1]
            score = getScore(lastScore)
        }
        frames.push(score)
        if (score == 10) {
            frames.push("x")
        }
    }
    else{
        if(isFrameStrike(18)&&maxFrames<22){
            maxFrames += 2
        }
        else if(isFrameSpare(18)&&maxFrames<21){
            maxFrames++
        }
    }
    // Update display after each roll
    updateWindow()
    buildScoreCard()
    console.log(highScore)
    console.log(scoreTotal)
}

const getScore = (pinsLeft) => {
    let thisScore = Math.floor(Math.random() * pinsLeft + 1)
    return thisScore
}

const calculateTotalScore = () => {
    frameScores = []
    var total = 0
    for (var i = 0; i < frames.length; i++) {
        if (frames[i] !== "x") {
            total += frames[i]
        }
        //Use the first score of each frame to calculate spare and strike status
        if (i % 2 == 0) {
            if (isFrameSpare(i)) {
                total += calculateSpareBonus(i)
            }
            if (isFrameStrike(i)) {
                total += calculateStrikeBonus(i)
            }
            frameScores.push(total)
        }
        else{
            frameScores[frameScores.length-1] = total
        }
    }
    scoreTotal = total
    topScoreDisplay.innerText = updateHighScore()
    return total
}

const toggleCheaterMode = () => {
    loser = false
    cheater = !cheater
}

const toggleLoserMode = () => {
    cheater = false
    loser = !loser
}

const isFrameSpare = (idx) => {
    return frames[idx] + frames[idx + 1] == 10
}

const isFrameStrike = (idx) => {
    return frames[idx] === 10
}

const calculateSpareBonus = (idx) => {
    if (frames[idx + 2]) {
        return frames[idx + 2]
    }
    return 0
}

const calculateStrikeBonus = (idx) => {
    let frameBonus = 0
    let bonusCount = 0
    let i = 1
    while (bonusCount < 2 && i < frames.length - 1) {
        if (frames[idx + i]) {
            if (frames[idx + i] == "x") {
                i++
                continue
            }
            frameBonus += frames[idx + i]
            bonusCount++
        }
        i++
    }
    return frameBonus
}

const updateWindow = () => {
    scoreDisplay.innerText = calculateTotalScore()
    frameDisplay.innerText = Math.ceil(frames.length / 2)
}

const newGame = () => {
    scoreTotal = 0
    frames = []
    cheater = false
    loser = false
    frameScores = []
    scoreCard.style.visibility = "hidden"
    scoreCard.innerHTML = ""
    updateWindow()
}

const updateHighScore = () => {
    highScore = Math.max(highScore, scoreTotal)
    return highScore
}

const editFrame= () => {
    let idx = frameEdit.value-1
    let newScore = frameScoreEdit.value
    if( idx > frames.length ){
        alert("Hey you didnt even bowl that frame yet!")
        return
    }
    console.log(idx)
    console.log(newScore)
    frames[idx] = parseInt(newScore)
    frameEdit.value = ""
    frameScoreEdit.value = ""
    buildScoreCard()
    updateWindow()
}

const buildScoreCard = () => {
    updateWindow()
    scoreCard.style.visibility = "visible"
    let cardInfo = []
    scoreCard.innerHTML = ""
    for (let i = 0; i < frames.length; i += 2) {
        cardInfo.push([frames[i], frames[i + 1]])
    }
    for (let i in cardInfo) {
        let frameTotal = cardInfo[i][1] && cardInfo[i][1] !== "x" ? cardInfo[i][0] + cardInfo[i][1] : cardInfo[i][0]
        if(cardInfo[i][0] == 10){
            frameTotal = "❌"
        }
        if(frameTotal == 10){
            frameTotal = "/"
        }
        scoreCard.innerHTML += `
        <div class="frame">
                <div class="top_frame">
                    <h3 class="score_wrapper">${cardInfo[i][0]}</h3>-<h3 class="score_wrapper">${cardInfo[i][1] ? cardInfo[i][1] : "-"}</h3>
                </div>
                <h2>${frameTotal}</h2>
                <h2>${frameScores[i]}</h2>
            </div>
        `
    }
}

