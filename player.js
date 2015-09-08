var Player = function()
{
	this.image = document.createElement("img");
	
	this.x = 9 * TILE;
	this.y = 0 * TILE;
	
	this.width = 159;
	this.height = 163;
	
	this.offset_x = -55;
	this.offset_y = -87;
	
	this.velocity_x = 0;
	this.velocity_y = 0;
	
	this.falling = true;
	this.jumping = false;	
	
	this.image.src = "hero.png";
}

Player.prototype.update = function(dt)
{
	var left = false;
	var right = false;
	var jump = false;
	
	if (keyboard.isKeyDown(keyboard.KEY_LEFT))
	{
		left = true;
	}
	if (keyboard.isKeyDown (keyboard.KEY_RIGHT))
	{
		right = true;
	}
	if (keyboard.isKeyDown (keyboard.KEY_SPACE))
	{
		jump = true;
	}
	
	var wasleft = (this.velocity_x < 0);
	var wasright = (this.velocity_x > 0);
	var falling = this.falling;
	
	var ddx = 0;
	var ddy = GRAVITY;
	
	if (left)
		ddx = ddx - ACCEL;
	else if (wasleft)
		ddx = ddx + FRICTION;	
	
	if (right)
		ddx = ddx + ACCEL;
	else if (wasright)
		ddx = ddx - FRICTION;
	
	if (jump && !this.jumping && !falling)
	{
		ddy = ddy - JUMP;
		this.jumping = true;
	}
	
	this.x = Math.floor( this.x + (dt * this.velocity_x));
	this.y = Math.floor( this.y + (dt * this.velocity_y));
	
	this.velocity_x = bound(this.velocity_x + (dt * ddx), -MAXDX, MAXDX);
	this.velocity_y = bound(this.velocity_y + (dt * ddy), -MAXDY, MAXDY);
	
	if ((wasleft && (this.velocity_x > 0)) ||
		(wasright && (this.velocity_x < 0)))
	{
		this.velocity_x = 0;	
	}
	
	var tx = pixelToTile(this.x);
	var ty = pixelToTile(this.y);
	var nx = (this.x) % TILE;
	var ny = (this.y) % TILE;
	
	var cell =      cellAtTileCoord(LAYER_PLATFORMS, tx,     ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown =  cellAtTileCoord(LAYER_PLATFORMS, tx,     ty + 1);
	var celldiag =  cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	
	//downward
	if (this.velocity_y > 0)
	{
		if ((celldown && !cell) || (celldiag && !cellright && nx))
		{
			this.y = tileToPixel (ty);
			this.velocity_y = 0;
			this.falling = false;
			this.jumping = false;
			ny = 0;						
		}
	}
	//upwards
	else if (this.velocity_y < 0)
	{
		if ((cell && !celldown) || (cellright && !celldiag && nx))
		{
			this.y = tileToPixel(ty + 1);
			this.velocity_y = 0;
			cell = celldown;
			cellright = celldiag;
			ny = 0;
		}
	}
	
	if (this.velocity_x > 0)
	{
		if ((cellright && !cell) || (celldiag && !celldown && ny))
		{
			this.x = tileToPixel(tx);
			this.velocity_x = 0;
		}
	}
	//left
	else if (this.velocity_x < 0)
	{
		if ((cell && !cellright) || (celldown && !celldiag && ny))
		{
			this.x = tileToPixel(tx + 1);
			this.velocity_x = 0;
		}
	}
}

Player.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, 
				this.offset_x, this.offset_y);	
	context.restore();
}

