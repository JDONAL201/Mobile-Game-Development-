class Items
{
	constructor (itemType, image,posX,posY, scrollRate,ctx)
	{
		this.itemType = itemType;
		this.ctx = ctx;
		this.image = new Image();
		this.image.src = image;
		this.spriteWidth = this.image.width;
		this.spriteHeight = this.image.height;
		this.x = posX;
		this.y = posY;
		this.vx = 0;
		this.speed = 6;
		this.scrollRate = scrollRate;
		this.visible = true;
		this.collision = false;
	}


	render()
	{
		if(this.visible)
		{
			this.ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
		}
	}

	update(delta)
	{
		this.vx *= 0.91;
      	this.x += this.vx;
		this.vx -= (scrollRate * this.speed ) * delta;
	}
}