class Particle
{
	constructor(image,x,y,ctx)
	{	
		this.image = image;
		this.x = x;
		this.y = y;
		//Animation
		this.spriteWidth = 144;
		this.spriteHeight = 200;
		this.frameX = 0;
		this.frameXMax = 5;
		this.frameTimer = 0.05;
		this.frameTimeMax = 0.017;
		this.visible = true;
		this.ctx = ctx;
	}

	render()
	{
	    if(this.visible)
	    {
			this.ctx.drawImage(this.image,this.spriteWidth * this.frameX, this.spriteHeight *0, this.spriteWidth, this.spriteHeight,this.x,this.y,this.spriteWidth,this.spriteHeight);
	    }
	}
}