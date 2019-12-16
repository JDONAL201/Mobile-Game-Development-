class Bullet
{
	constructor(image,posX,posY)
	{
		this.x = posX;
		this.y = posY;
		this.image = new Image();
		this.image.src = image;
		this.spriteWidth = 100;
		this.spriteHeight = 100;
		this.visible = true;
		this.collision = false;
		//this.sound = sound;
		//this.sound.play();
		this.type = "bullet";

		this.speed = 1;
		this.vx = 0;

	}

	Update(delta)
	{
		this.vx *= 0.91;
      	this.x += this.vx;
		this.vx += this.speed;
	}

	Draw(ctx)
	{
		if(this.visible)
		{
			ctx.drawImage(this.image,this.x,this.y,50, 50);
		}
	}
}