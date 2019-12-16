class Background
{
	constructor(x, y, velX,image,context , gameWidth,gameHeight)
	{	
		this.x = x;
		this.y = y;
		this.vx = velX;
		this.image = image;
		// this.image.src = imageSource;
		this.ctx = context;
		this.gameWidth = gameWidth;
		this.gameHeight = gameHeight;

	}

	renderScroll(delta)
	{
		this.ctx.save();
		this.ctx.translate(-delta,0);
		this.ctx.drawImage(this.image, 0,0,this.gameWidth,this.gameHeight);
		this.ctx.drawImage(this.image,this.gameWidth,0,this.gameWidth,this.gameHeight);
		this.ctx.restore();
	}

	renderStill()
	{
		this.ctx.drawImage(this.image,this.x,this.y);
	}
}