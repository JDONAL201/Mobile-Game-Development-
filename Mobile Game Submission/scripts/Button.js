class Button
{
    constructor(btnImage,ctx,x,y,audioClip)
    {
        this.image = btnImage;
        this.width = this.image.width;
        this.height = this.image.height;
        this.x =  x;
        this.y = y;
        this.clip = audioClip;
        this.clicked = false;
        this.ctx = ctx;
    }

    Render(mousePosX,mousePosY)
    {
        if(mousePosX > this.x && mousePosX < this.x + this.width 
                && mousePosY > this.y && mousePosY < this.y + this.height)
        {
            if(this.clicked == false)
            {
                this.clip.play();
                this.clicked = true;
            }
        }
         this.ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }   
}