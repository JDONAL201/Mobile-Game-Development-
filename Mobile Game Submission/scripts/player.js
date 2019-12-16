class Player
{
	constructor(x, y, velX,velY, imageSource, context,gameWidth,gameHeight)
	{	
		this.x = x;
		this.y = y;
		this.vx = velX;
		this.vy = velY;
		this.image = new Image();
		this.image.src = imageSource;
		this.ctx = context;
		this.speed = 0.5;

		this.gameHeight = gameHeight;
		this.gameWidth = gameWidth;
		
		//Animation
		this.spriteWidth = 144;
		this.spriteHeight = 144;
		this.frameX = 0;
		this.frameXMax =16;
		this.frame = 0;
		this.frameTimer = 0.05;
		this.frameTimeMax = 0.017;
	}
	render()
	{
		this.ctx.drawImage(this.image,this.spriteWidth * this.frameX, this.spriteHeight *0, this.spriteWidth, this.spriteHeight,this.x,this.y,this.spriteWidth,this.spriteHeight);
	}
	update(delta)
	{

      this.vx *= 0.91;
      this.vy *= 0.91;
      this.x += this.vx;
      this.y += this.vy;
      
      if(this.y > (700))
      	{
      	  		this.vy = 0;
      	}
      	else
      	{
      		this.vy += this.speed ;
   
      	}

      	if(this.x < (this.spriteWidth * 0.25))
      	{
      		this.x = this.spriteWidth * 0.25;
      	}

      if(this.y < this.spriteHeight * 0.25)
      	{
      		this.y = this.spriteHeight * 0.25;
      	}

	}
	get xPosition()
	{
		return this.x;
	}

	get yPosition()
	{
		return this.y;
	}

	set xPosition(newX)
	{
		this.x = newX;
	}

	set yPosition(newY)
	{
		this.y = newY;
	}
	spritePosition(newX,newY)
	{
		this.x = newX;
		this.y = newY;
	}
}