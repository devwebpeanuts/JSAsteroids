var Shoot = function(game) {
	this.game = game;
}

Shoot.prototype = new Moveable();
Shoot.prototype.constructor = Shoot;

Shoot.prototype.init = function(shooter) {
	
	Moveable.prototype.init.call(this);
	
	this.context = this.game.context;
	this.posx = shooter.posx + (15 * Math.sin(Math.PI * shooter.getShootAngle() / 180));
	this.posy = shooter.posy - (15 * Math.cos(Math.PI * shooter.getShootAngle() / 180));
	this.life_time = 0;
	
	this.shooter_angle = shooter.getShootAngle();
	this.shooter_velx = shooter.velx;
	this.shooter_vely = shooter.vely;
	
	if(shooter.type == 'player') {
	    this.max_life_time = 2000;
	    this.type = 'player_shoot';
	    this.vel_modifier = 3;
	} else if(shooter.type == 'saucer') {
	    this.max_life_time = 3000;
	    this.type = 'saucer_shoot';
	    this.vel_modifier = 2;
	} else {
	    this.max_life_time = 2000;
	}
	
	this.color = shooter.color;
	
	//this.game.audio.stopShoot(this.type);
    //this.game.audio.playShoot(this.type);
}	

Shoot.prototype.draw = function() {
	this.context.save();
	this.context.strokeStyle = this.color;
	this.context.shadowColor = this.color;
	this.context.lineWidth = 4;
	this.context.beginPath();
	this.context.translate(this.posx, this.posy);
    this.context.moveTo(-1,-1);
	this.context.lineTo(0,0);
	this.context.moveTo(0,-1);
	this.context.lineTo(-1,0);
	this.context.stroke();
	this.context.closePath();
	this.context.restore();
}

Shoot.prototype.setVelocity = function(time) {
    this.velx = (Math.sin((Math.PI * this.shooter_angle) / 180) * this.vel_modifier * time) + this.shooter_velx / 20;
    this.vely = (Math.cos((Math.PI * this.shooter_angle) / 180) * this.vel_modifier * time) + this.shooter_vely / 20;
}

Shoot.prototype.update = function() {
	this.life_time += this.game.time;
    
    this.setVelocity(this.game.time / 10);
    
	this.move(1, 1);
    
    this.draw();
}
