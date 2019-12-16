class Enemy
{

	constructor(x, y, imageSource, context)
	{	
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.image = new Image();
		this.image.src = imageSource;
		this.ctx = context;
		this.timer = 0;
		this.upForce = 10;
		this.downForce = 0.55;
		this.visible = true;
		this.collision = false
		this.speed =8;
		this.timerReset = 0.2;

		this.spriteWidth = 144;
		this.spriteHeight = 144;
		this.frameX = 0;
		this.frameXMax = 14;
		this.frame = 0;
		this.frameTimer = 0.05;
		this.frameTimeMax = 0.017;
	}
	render()
	{
		if(this.visible)
		{
			this.ctx.drawImage(this.image,this.spriteWidth * this.frameX, this.spriteHeight *0, this.spriteWidth, this.spriteHeight,this.x,this.y,this.spriteWidth,this.spriteHeight);
		}
		
	}
	
	update(delta,scrollRate)
	{

	this.vx *= 0.91;
      this.vy *= 0.91;
      this.x += this.vx;
      this.y += this.vy;

     // if(this.timer <= 0)
      //{
      	//this.upForce =15;
      	//this.vy -= this.upForce;
      	//this.timer = this.timerReset;
     // }
     // else
     // {
     // 	this.timer -= delta;
     // 	this.vy += this.downForce;
     // }

      if(this.y >= (window.innerHeight- this.spriteHeight))
      {
      	this.y = window.innerHeight -  this.spriteHeight;
      }
      else if(this.y <= this.spriteHeight * 0.25)
      {
      	this.y = this.spriteHeight * 0.25;
      }

      this.vx -= (scrollRate * this.speed) * delta;
	}
}