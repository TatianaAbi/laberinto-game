const canvas = document.querySelector('#game');
const game = canvas.getContext('2d')
const btnUp = document.getElementById('btnUp')
const btnLeft = document.getElementById('btnLeft')
const btnRight = document.getElementById('btnRight')
const btnDown = document.getElementById('btnDown')
const spanLives = document.querySelector('#lives')
const spanTime = document.querySelector('#time')
const pResult = document.querySelector('#result')
const spanRecord = document.querySelector('#record')

let canvasSize;
let elementSize;
let level = 0
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
}
const gifPosition = {
    x: undefined,
    y:undefined,
}
let enemyPositions = []

window.addEventListener('load', setcanvasSize);
// resize 'cambio de tamaño' nos avisa cuando el canvas cambiara de tamaño
window.addEventListener('resize', setcanvasSize)

function fixNumber (n){
return Number(n.toFixed(0))
}

function setcanvasSize(){
    
    if(window.innerHeight > window.innerWidth){
     canvasSize = window.innerWidth * 0.65;
    }if(window.innerWidth > window.innerHeight){
     canvasSize = window.innerHeight * 0.65;
    }

    canvasSize = Number(canvasSize.toFixed(0))

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)
    
    //el valor del espacio del mapa dividido en 10 espacios
    elementSize = canvasSize / 10;
    
    playerPosition.x = undefined
    playerPosition.y= undefined
    startGame()
}
function startGame(){
    
    //definimos el tamaño de la bomba
    game.font = elementSize +'px Verdana'
    game.textAlign = 'end';
    
    const map = maps[level];

    if(!map){
        gameWin()
        return;
    }
    if(!timeStart){
        timeStart = Date.now();
        //timeInterval imprimira el valor del tiempo cada 100 milisegundos permitiendo que en cada momento el usuario vea el tiempo correr y no solo un numero estatico
        timeInterval = setInterval(showTime, 100);
        showRecord()
    }
    //split sirve para saber cuando debemos hacer la division de un elementotrim eliminar los espacios ignecesarios
    //
    const mapRows = map.trim().split('\n')
    const mapRowsCols = mapRows.map(row => row.trim().split(''))

    showLives()
    
    enemyPositions = []
    game.clearRect(0,0,canvasSize, canvasSize)

    mapRowsCols.forEach((row, rowI) =>{
        row.forEach((col,colI) =>{
            const emoji = emojis[col];
            const posX = elementSize * (colI + 1)
            const posY = elementSize * (rowI + 1)

            if(col == 'O'){
                if(!playerPosition.x && !playerPosition.y){
             playerPosition.x = posX
             playerPosition.y = posY
             console.log({playerPosition})
                }
            }else if(col == 'I'){
                gifPosition.x = posX;
                gifPosition.y = posY
            }else if(col == 'X'){
                enemyPositions.push({
                    x: posX,
                    y: posY,
                })
            }
            game.fillText(emoji, posX, posY)
        })

       
    })
    movePlayer()
}

function movePlayer(){
    const giftCollisionX = playerPosition.x.toFixed(3) == gifPosition.x.toFixed(3)
    const giftCollisionY = playerPosition.y.toFixed(3) == gifPosition.y.toFixed(3)
    const CoalicionConRegalo = giftCollisionX && giftCollisionY
    if(CoalicionConRegalo){
        levelWin()
      }
    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
      });
      
      if (enemyCollision) {
       levelFail()
      }

    game.fillText(emojis['PLAYER'], playerPosition.x,playerPosition.y)
}

function levelWin(){
    level++
    startGame()
   
}

function levelFail(){
    
    lives--;
    if(lives <= 0){
        level = 0
        lives = 3
        timeStart = undefined
    }
    playerPosition.x = undefined
    playerPosition.y = undefined
    startGame()
}
function gameWin(){
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime){
    if(recordTime >= playerTime){
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'GENIAL!! superaste el record'
    }else{
        pResult.innerHTML = 'lo siento, tu puntaje no supero el record :('
        console.log('no superaste el record')
    }
    }else{
        localStorage.setItem('record_time', playerTime)
        
        pResult.innerHTML = 'primera vez? Genial ahora supera tu record'
    }
}
function showLives(){
    const heartsArray = Array(lives).fill(emojis['HEART'])
    spanLives.innerHTML = emojis['HEART']

    spanLives.innerHTML ="";
    heartsArray.forEach(heart => spanLives.append(heart))

}
function showTime(){
    spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord(){
    spanRecord.innerHTML =localStorage.getItem('record_time')
}
window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moverArriba)
btnLeft.addEventListener('click',moverDerecha)
btnRight.addEventListener('click', moverIzquierda)
btnDown.addEventListener('click',moverAbajo)

function moveByKeys(event){
    if(event.key == 'ArrowUp') moverArriba();
    else if(event.key == 'ArrowLeft') moverDerecha();
    else if(event.key == 'ArrowRight') moverIzquierda()
    else if(event.key == 'ArrowDown') moverAbajo()
}
function moverArriba(){
    if((playerPosition.y - elementSize ) < elementSize){
        console.log('llegaste al limite')
    }else{
        console.log('me muevo arriba')
        playerPosition.y -= elementSize
        startGame()
    }
    
    
}

function moverDerecha(){
    if((playerPosition.x - elementSize) < elementSize){
        console.log('llegaste al limite')
    }else{
        console.log('me muevo derecha')
        playerPosition.x -= elementSize
        startGame()
    }


    
}

function moverIzquierda(){
    if((playerPosition.x + elementSize) > canvasSize){
        console.log('llegaste al limite')
    }else{
    console.log('me muevo izquierda')
    playerPosition.x += elementSize
    startGame()}
}

function moverAbajo(){
    if((playerPosition.y + elementSize) > canvasSize){
        console.log('llegaste al limite')
    }else{
    console.log('me muevo abajo')
    playerPosition.y += elementSize
    startGame()}
}
