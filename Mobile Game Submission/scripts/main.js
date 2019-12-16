//GAMESTATE 
const GAME_STATE = { MENU:0, LEVEL1: 1, GAMEOVER:2 ,OPTIONS:3 }
var gameState;
var gamePaused = false;
//CANVAS
var layer0,layer1,layer2,layer3;
var ctx0,ctx1,ctx2,ctx3;
var width, height;
//ASSETS
var level1Background;
var player;
//audio
var fireAudio = new Audio();
var levelMusic = new Audio();
var highScoreAudio = new Audio();
var buttonClip = new Audio();
var coinSound = new Audio();
var impactSound = new Audio();
var impactSplatSound = new Audio();
var energySound = new Audio();
//images
var optionsImage;
var backgroundImage = new Image();
var titleImage = new Image();
var playbtnImage = new Image();
var resetButtonImage = new Image();
var highScoreImage = new Image();
var skullCounterImage = new Image();
var splatSheet = new Image();
var energyImage = new Image();
var wasdImage = new Image();
var spaceImage = new Image();
var mouseImage = new Image();
//FOR TIME
var movement = 0;
var startTime;
//Items
var coins = [];
var coinSpawn = 0;
var coinSpawnDelay = 4.5;
var xSpawn, ySpawn;
var energy = [];
var energyTime =0;
var energyRate =7;

//Score
let score = 0;
let highScore = 220;
//FOR INPUT
var keys = [];

//Enemies
var enemies = [];
var spawnTime = 0;
var spawnDelay = 0.5;

//Firing
var bullets = [];
var killCount = 0;
var maxAmmo = 8;
var ammo = maxAmmo;
var particles = [];

//SETTINGS 
var scrollRate = 7;
//Buttons
var playButton,resetButton,optionsButton;

//MOUSE
var mouseX =0;
var mouseY = 0;
//GAMEPAD

var deltaTime = 0;



window.onload  = window.onresize = Start;


function Start()
{
    gameState = GAME_STATE.MENU;
    startTime = Date.now();
    InitLayers();
    InitAssets();
    InitObjects();
    InitInput();
 
    GameLoop();
}
function InitAssets()
{
    //image for button wouldnt load unless it was preloaded via html
    playbtnImage = document.getElementById("play");
    resetButtonImage  = document.getElementById("reset");
    optionsImage = document.getElementById("options");
    fireAudio = document.getElementById("fire");

    buttonClip.src = "audio/button.wav";
    backgroundImage.src = "images/level1Background.jpg";
    titleImage.src = "images/title.png";
    highScoreImage.src = "images/HighScores.png";
    skullCounterImage.src = "images/skull.png";
    splatSheet.src = "images/splat.png";
    energyImage.src = "images/energy.png";
    wasdImage.src ="images/wasd.png";
    mouseImage.src ="images/leftclick.png"
    spaceImage.src = "images/spacebar.png";

    levelMusic.src = "audio/level1Music.mp3";
    highScoreAudio.src = "audio/highscores.wav";
    coinSound.src = "audio/coinSound.wav";
    impactSound.src = "audio/impact.wav";
    impactSplatSound.src = "audio/impactSplat.wav";
    energySound.src ="audio/energySound.wav";

}
function InitObjects()
{
    playButton = new Button(playbtnImage,ctx1,width/2 - playbtnImage.width/2,height/2 + playbtnImage.height,buttonClip);
   
    level1Background = new Background(0,0,100,backgroundImage,ctx0, width,height);
    player = new Player(10,100,0,0,"images/playerSpriteSheet.png",ctx1);
     optionsButton = new Button(optionsImage,ctx1,width/2 - optionsImage.width/2,height/2 + (optionsImage.height * 2),buttonClip);
    var enemy = new Enemy(width,300,"images/infected.png",ctx2)
    enemies[0] = enemy;
    spawnTime = spawnDelay;

    coinSpawn = coinSpawnDelay;
    xSpawn = width + 50;

    resetButton = new Button(resetButtonImage,ctx1,width - resetButtonImage.width,height - resetButtonImage.height,buttonClip);

}
function InitLayers()
{
    width = window.innerWidth;
    height = window.innerHeight;

    layer0 = document.getElementById('layer0');
    ctx0 = layer0.getContext('2d');
    layer0.width = width;
    layer0.height= height;

    layer1 = document.getElementById('layer1');
    ctx1 = layer1.getContext('2d');
    layer1.width = width;
    layer1.height= height;

    layer2 = document.getElementById('layer2');
    ctx2 = layer2.getContext('2d');
    layer2.width = width;
    layer2.height= height;
    
    layer3 = document.getElementById('layer3');
    ctx3 = layer3.getContext('2d');
    layer3.width = width;
    layer3.height= height;

}
function GameLoop()
{
    var elapsed = (Date.now() - startTime) /1000;

    deltaTime = elapsed;
    

    switch(gameState)
    {

        case GAME_STATE.MENU:
            RenderMenu(elapsed);
            if(playButton.clicked){SwitchScene(GAME_STATE.LEVEL1);}
            if(optionsButton.clicked){SwitchScene(GAME_STATE.OPTIONS);}
        break;

        case GAME_STATE.LEVEL1:
            if(!gamePaused)
            {
                movement += elapsed * level1Background.vx * scrollRate;
                if(movement > width){ movement = 0; }
                RenderGame(elapsed);
                Update(elapsed);
            }
        break;

         case GAME_STATE.OPTIONS:
          if(playButton.clicked){SwitchScene(GAME_STATE.LEVEL1);}
            RenderOptionsMenu(elapsed);
            break;

        case GAME_STATE.GAMEOVER:
        RenderHighScores();
        if(resetButton.clicked)
        {
            Reset(); 
            SwitchScene(GAME_STATE.LEVEL1);
        }
        break;
    }

    startTime = Date.now();
    requestAnimationFrame(GameLoop);
}
function Update(delta)
{
    Animate(player,delta);
    player.update(delta);
    PlayerInput();
    UpdateGame(delta);
}

function UpdateGame(delta)
{
    score += 1 * delta;

    CoinSpawner(delta);
    ItemUpdater(coins,delta);

    EnergySpawner(delta);
    ItemUpdater(energy,delta);


    if(bullets.length  !== 0)
        {
            for(let i = 0; i < bullets.length; i++)
            {
                bullets[i].Update(delta);
                bullets[i].Draw(ctx2);
                if(bullets[i].visible)
                {
                    CheckCollisions(bullets[i],enemies);
                }
        
                if(bullets[i].x > window.outerWidth)
                {
                    bullets.shift();
                }
            }
        }

    if(spawnTime > 0)
    {
        spawnTime -= delta;
    }
    else
    {
        spawnTime = 0;
    }

    if(enemies.length > 0)
    {
        CheckCollisions(player,enemies);
        for(var i =0; i < enemies.length; i++)
        {
            if(enemies[i].x < -enemies[i].spriteWidth && enemies.length > 1)
            {
                enemies.shift();
                continue;
            }
            enemies[i].render();
            enemies[i].update(delta,scrollRate);
            Animate(enemies[i],delta);
            //enemies[i].animate(delta,14);

            if(spawnTime <=0)
            {
                spawnTime = spawnDelay;
                var spawnHeight = RandomScreenPos();
                enemies.push(new Enemy(width,spawnHeight,"images/infected.png",ctx2));
                
            }
        }
    }

    for(var i =0; i < particles.length; i++)
    {
        if(particles[i].visible)
        {
            ParticleAnimate(particles[i],delta);
        }
        else
        {
            particles.shift();
        }
    }

}


function ItemUpdater(array,delta)
{
    if(array.length > 0)
    {
        CheckCollisions(player,array);

        for(var i = 0; i< array.length; i++)
        {
            array[i].render();
            array[i].update(delta);
            
            if(array[i].x < -array[i].spriteWidth)
            {
                array.shift()
                continue;
            }
           
        }
    }
}


function RenderMenu(delta)
{   
    ClearLayers();
    ctx0.drawImage(backgroundImage,0,0,width,height);

    ctx1.fillStyle = 'black';
    ctx1.fillRect(0,0,width,height);
    ctx1.globalAlpha = 0.9;

    ctx2.drawImage(titleImage,width/2 - (titleImage.width * 1.5)/2 ,
        titleImage.height,titleImage.width * 1.5,titleImage.height *1.5)
    
    playButton.Render(mouseX,mouseY,delta);
    optionsButton.Render(mouseX,mouseY,delta);
}
function RenderOptionsMenu(delta)
{
    ClearLayers();

    ctx0.drawImage(backgroundImage,0,0,width,height);

    //UI
    ctx3.fillStyle = 'orange';
    ctx3.font ='30px Impact';
    //WASD
    ctx3.drawImage(wasdImage,100,100,wasdImage.width/2,wasdImage.height/2);
    ctx3.fillText("WASD: Move player", wasdImage.width/2 + 80, 300);
    //MOUSE
    ctx3.drawImage(mouseImage,width-mouseImage.width,100,mouseImage.width/2,mouseImage.height/2);
    ctx3.fillText("LeftClick: Use jetpack thrusters", width - mouseImage.width, 400);
    //SPACE
    ctx3.drawImage(spaceImage,100,400,spaceImage.width/2,spaceImage.height/2);
    ctx3.fillText("Spacebar: fire gun", spaceImage.width/2 + 80, 700);

    ctx1.fillStyle = 'black';
    ctx1.fillRect(0,0,width,height);
    ctx1.globalAlpha = 0.9;
    playButton.Render(mouseX,mouseY,delta);
}
function RenderGame(delta)
{
    ClearLayers();
    level1Background.renderScroll(movement);
    player.render();
    ctx2.fillStyle = 'orange';
    ctx2.font ='40px Impact';
    ctx2.fillText("X " + killCount , width/2 - skullCounterImage.width/2 + 120,100);
    ctx2.drawImage(skullCounterImage,width/2 - skullCounterImage.width/2, 20,100,100);
    ctx2.font = '40px Impact';
    ctx2.fillText('SCORE: ' + score.toFixed(0).toString(),100,100);
    ctx2.drawImage(energyImage,width - energyImage.width - 20,20,energyImage.width,energyImage.height);
    ctx2.fillText(ammo + " X"  , (width - energyImage.width)- 80 ,100);
}
function Animate(object,delta)
{   
     object.frameTimer = object.frameTimer - delta;
        
        if(object.frameTimer <= 0)
        {
            object.frameTimer = object.frameTimeMax;
            object.frameX++;

            if(object.frameX > object.frameXMax)
            {
                object.frameX = 0;
            }
        }
        object.render();
}
function ParticleAnimate(object,delta)
{

        object.frameTimer = object.frameTimer - delta;
        
        if(object.frameTimer <= 0)
        {
            object.frameTimer = object.frameTimeMax;
            object.frameX++;

            if(object.frameX > object.frameXMax)
            {
                object.visible = false;
            }
        }
        object.render();
}
function RenderHighScores()
{    
    ClearLayers();
    ctx0.drawImage(backgroundImage,0,0,width,height);
    ctx1.fillStyle = 'black';
    ctx1.fillRect(0,0,width,height);
    ctx1.globalAlpha = 0.9;
    ctx2.drawImage(highScoreImage,width/2 - highScoreImage.width/2, highScoreImage.height, highScoreImage.width, highScoreImage.height);
    
    resetButton.Render(mouseX,mouseY);
    
   
    ctx3.fillStyle = 'orange';
    
    if(score > highScore)
    {   
        ctx3.font = '100px Impact';
        ctx3.fillText( "New HighScore", width/2-275, 400);
        ctx3.font = '80px Impact';
        ctx3.fillText( score.toFixed(0).toString(), width/2-55, 500);
        highScore = score;
    }
    else
    {
        ctx3.font = '100px Impact';
        ctx3.fillText( "Highscore", width/2 -225, 300);
        ctx3.font = '80px Impact';
        ctx3.fillText( highScore.toFixed(0).toString(), width/2-55, 400);
        ctx3.font = '100px Impact';
        ctx3.fillText( "Your score", width/2-225, 600);
        ctx3.font = '80px Impact';
        ctx3.fillText( score.toFixed(0).toString(), width/2-55, 700);
    }
}
function ClearLayers()
{
    ctx0.clearRect(0,0,width,height);
    ctx1.clearRect(0,0,width,height);
    ctx2.clearRect(0,0,width,height);
    ctx3.clearRect(0,0,width,height);
}
function SwitchScene(nextState)
{
    gameState = nextState;
    
    if(nextState == GAME_STATE.GAMEOVER)
    {   
        levelMusic.pause();
        highScoreAudio.play();
    }
    else
    {
        levelMusic.play();
    }
}
function MousePosition(event)
{

    mouseX = event.clientX;
    mouseY = event.clientY;
    player.vy -= 12;

    if(gameState == GAME_STATE.MENU)
    {
        levelMusic.play();
        
        if(gameState == GAME_STATE.LEVEL1)
        {
            levelMusic.play();
        }
    } 
}
function GamePadUpdate()
{
    gamepadAPI.update();

   
}
   
function PlayerInput()
{
        if(keys[68])
        {
            player.vx += 0.4;
        }
        if(keys[65])
        {
            player.vx -= 0.4;
        }
        
}
function InitInput()
{
    
    document.body.addEventListener("mouseup", function (event) 
    {
        MousePosition(event);
    });
    document.body.addEventListener("mousedown", function (event) 
    {
        MousePosition(event);
    });

    document.body.addEventListener("keydown", function (event) 
    {
        keys[event.keyCode] = true;
    });

    document.body.addEventListener("keyup", function (event) 
    {
        keys[event.keyCode] = false;

        if(gameState != GAME_STATE.LEVEL1) {return;}
        switch(event.keyCode)
        {
            case 32:
            if(ammo > 0)
            {
                ammo-=1;
                bullets.push(new Bullet("images/bullet.png",player.x + 125,player.y + 70));  
                fireAudio.play();
            }
            break;
        }
    });


}
function CollisionDetection(colliderA,colliderB)
{
    //changed halfs to 3rds to reduce collision size
    var vectorX =(colliderA.x + (colliderA.spriteWidth *0.4)) - (colliderB.x + (colliderB.spriteWidth*0.4));
    var vectorY =(colliderA.y + (colliderA.spriteHeight*0.4)) - (colliderB.y + (colliderB.spriteHeight*0.4));
    var halfWidths= (colliderA.spriteWidth *0.4) + (colliderB.spriteWidth*0.4);
    var halfHeights = (colliderA.spriteHeight*0.4 ) + (colliderB.spriteHeight*0.4);

    var collisionDirection = null;

    if (Math.abs(vectorX) < halfWidths-10 && Math.abs(vectorY) < halfHeights-10)
     {
            // figures out on which side we are colliding (top, bottom, left, or right)
            var oX = halfWidths - Math.abs(vectorX);
            var oY = halfHeights - Math.abs(vectorY);
            if (oX >= oY) 
            {
                if (vectorY > 0) 
                {
                    collisionDirection = "t";
                } 
                else 
                {
                    collisionDirection = "b";
                }
            } 
            else 
            {
                if (vectorX > 0) {
                    collisionDirection = "l";

                }
                else 
                {
                    collisionDirection = "r";
                }
            }
        }
    return collisionDirection;
}  
function CheckCollisions(inputObject,inputArray)
{
    for(var i = 0; i < inputArray.length; i++)
        {
            if(inputArray[i].collision == true)
            {
                continue;
            }
            else
            {
                var dir = CollisionDetection(inputObject, inputArray[i]);

                if (dir === "l" || dir === "r")
                {  
                    if(inputObject.type == "bullet")
                    {
                        inputObject.collision = true;
                        inputObject.visible = false;
                        inputArray[i].collision = true;
                        inputArray[i].visible = false;
                        impactSound.play();
                        particles.push(new Particle(splatSheet,inputArray[i].x,inputArray[i].y,ctx2));
                        impactSplatSound.play();
                        killCount +=1;
                        return;
                    }
                    
                    if(inputArray[i].collision == false)
                    {
                        if(inputArray[i].itemType == "coin")
                            {
                                score += 2;
                                inputArray[i].collision = true;
                                inputArray[i].visible = false;
                                coinSound.play();
                                return;
                            }
                            else if(inputArray[i].itemType == "energy")
                            {
                                ammo = maxAmmo;
                                inputArray[i].collision = true;
                                inputArray[i].visible = false;
                                energySound.play();
                                return;
                            }
                    }
                
                    SwitchScene(GAME_STATE.GAMEOVER);
                    return;
                }
                else if(dir === "t" || dir === "b")
                {
                    if(inputObject.type == "bullet")
                    {
                        inputObject.collision = true;
                        inputObject.visible = false;
                        inputArray[i].collision = true;
                        inputArray[i].visible = false;
                        particles.push(new Particle(splatSheet,inputArray[i].x,inputArray[i].y,ctx2));
                        impactSound.play();
                        impactSplatSound.play();
                        killCount +=1;
                        return;
                    }
                    
                   if(inputArray[i].itemType == "coin")
                    {
                        score += 2;
                        inputArray[i].collision = true;
                        inputArray[i].visible = false;
                        coinSound.play();
                        return;
                    }
                    else if(inputArray[i].itemType == "energy")
                    {
                        ammo = maxAmmo;
                        inputArray[i].collision = true;
                        inputArray[i].visible = false;
                        energySound.play();
                        return;
                    }
                    SwitchScene(GAME_STATE.GAMEOVER);
                    return;
                }
            }
        }   
} 
function CoinSpawner(delta)
{
    if(coinSpawn <= 0)
    {
        coinSpawn = coinSpawnDelay;

        var spawnType = Math.floor(Math.random() * (5 - 1)) + 1;
        var spawnPos= Math.floor(Math.random() * (8 - 3)) +3;
        spawnPos*=100;

        for(var i = 0; i < 4; i++)
            {   
              ySpawn = spawnPos;

                for(var j = 0; j < spawnType; j++)
                    {
                        coins.push(new Items("coin","images/coin.png",xSpawn,ySpawn,scrollRate,ctx2));
                        ySpawn-= 60;
                    }
                xSpawn += 60;
            }
    }
    else
    {
        coinSpawn -= delta;
    }
}
function EnergySpawner(delta)
{
    if(energyTime >= 0)
    {
        energyTime -= delta;
    }
    else
    {
        energyTime = 0;
    }

    if(energyTime <= 0)
    {
        energyTime = energyRate;
        var spawnHeight = RandomScreenPos();
        energy.push(new Items("energy","images/energy.png",width + 50,spawnHeight,scrollRate,ctx2));
    }
}
function RandomScreenPos()
{
    var rand = Math.floor(Math.random() * 4)
    var temp;
    switch(rand)
    {
        case 0:
        temp = height * 0.2;
        break;

        case 1:
        temp = height * 0.35;
        break;

        case 2:
        temp = height * 0.5;
        break;

        case 3:
        temp = height *0.65;
        break;

        case 4:
        temp = height *0.8;
        break;
    }
    return temp;
}
function Reset()
{
    resetButton.clicked = false;
    playButton.clicked = false;
    startTime = Date.now();
    particles.length =0;
    coins.length = 0;
    enemies.length =0;
    bullets.length = 0;
    score = 0;
    ammo = maxAmmo;
    killCount = 0;
    player.x = 10;
    player.y =100;
    
    var enemy = new Enemy(width,300,"images/infected.png",ctx2)
    enemies[0] = enemy;
    spawnTime = spawnDelay;

}


