var Explosion = function(game, posx, posy) {
	this.game = game;
	this.context = this.game.context;
	this.posx = posx;
	this.posy = posy;
	this.life_time = 0;
	this.max_life_time = 750;
	this.color = "#FFFFFF";
	this.points = [];
	
	var i = 0;
	while(i < 12) {
		var point = {};
		var direction = i * 30;
		var speed = Math.random() - 0.2;
		point.posx = posx;
		point.posy = posy;
		point.velx = Math.sin((Math.PI * direction) / 180) * speed;
		point.vely = Math.cos((Math.PI * direction) / 180) * speed;
		this.points.push(point);
		i++;
	}
}

Explosion.prototype.draw = function() {
	var i = 0;
	this.context.save();
	
	this.context.strokeStyle = this.color;
    this.context.shadowColor = this.color;
    
	
	while(i < 12) {
		this.context.beginPath();
		this.context.moveTo(this.points[i].posx,this.points[i].posy);
		this.context.lineTo(this.points[i].posx + 1, this.points[i].posy + 1);
		this.context.stroke();
		this.context.closePath();
		i++;
	}
	this.context.restore();
}

Explosion.prototype.update = function() {
	this.life_time += this.game.time;
	var i = 0;
	while(i < 12) {
		this.points[i].posx += this.points[i].velx * this.game.time / 10;
    	this.points[i].posy += this.points[i].vely * this.game.time / 10;
    	i++;
	}
	
	this.draw();
}
