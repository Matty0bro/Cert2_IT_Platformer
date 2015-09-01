var Player = function()
{
	this.image = document.createElement("img");
	this.image.src = "hero.png";
	
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.rotation = 0;
}

Player.prototype.update = function(dt)
{
	//if ( typeof (this.rotation) == "undefined")
	//	this.rotation = 0;
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE))
	{
		this.rotation -= dt;
	}
	else
	{
		this.rotation += dt;
	}
}

Player.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, 
				-this.image.width/2, -this.image.height/2);	
	context.restore();
}

