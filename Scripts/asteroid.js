var shapes = new Array();
shapes.push([[0, 24, 30, 24, 26, 18, 12, 6, -18, -20, -16, -20, -20, 0],
			 [-30,-24,-16,-8,4,16,12,24,20,14,4,-12,-28,-30]]);
						 
shapes.push([[0,16,18,12,4,-10,-4,-10,0],
			 [-20,-16,-8,4,8,-2,-6,-14,-20]]);

shapes.push([[0,8,10,8,2,-2,-4,0],
		 	 [-10,-8,-4,4,6,6,2,-10]]);


var Asteroid = function(game) {
	this.game = game;
}

Asteroid.prototype = new Moveable();
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.init = function(num_shape, posx, posy) {
	
	Moveable.prototype.init.call(this);
	
	this.offscreen = 50;
	this.num_shape = num_shape;
	this.shape = new Array(shapes[num_shape][0].slice(0), shapes[num_shape][1].slice(0));
	this.poly_sides = this.shape[0].length;
	this.nodes_pos = new Array(this.shape[0].slice(0), this.shape[1].slice(0));
	this.posx = posx;
	this.posy = posy;
	this.direction = Math.random() * 360;
	this.speed = Math.random() + 0.1;
	this.angle = 0;
	this.speed_turn = Math.random();
	this.destroyed = false;
	this.score_points = new Array(10,50,100);
}	


Asteroid.prototype.draw = function() {
	this.context.save();
	this.context.strokeStyle = this.color;
	this.context.fillStyle = this.fill_color;
	this.context.shadowColor = this.color;
	this.drawShape();
	this.context.restore();
}

Asteroid.prototype.setVelocity = function(time) {
    this.velx = Math.sin((Math.PI * this.direction) / 180) * this.speed * time;
    this.vely = Math.cos((Math.PI * this.direction) / 180) * this.speed * time;
}

Asteroid.prototype.update = function(index) {
	this.setVelocity(this.game.time / 10);
	this.setAngle();
	this.move(1, 1);
	this.draw();
	
	this.updateCollisionPoints();
	this.detectCollision(index);
    
}

Asteroid.prototype.detectCollision = function(index) {
	for(j=0; j < this.game.shoots.length; j++) {
		if(this.isPointInPoly(this.game.shoots[j].posx, this.game.shoots[j].posy)) {
			if(this.game.shoots[j].type == 'player_shoot') {
			    this.game.updateScore(this.score_points[this.game.asteroids[index].num_shape]);
			}
			this.game.removeMoveableObject(this.game.shoots, j);
			this.destroy(index);
			return;
		}
	}
	
	if(!this.game.ship.destroyed) {
		for(j=0; j < this.game.ship.poly_sides; j++) {
			if(this.isPointInPoly(this.game.ship.nodes_pos[0][j], this.game.ship.nodes_pos[1][j])) {
	    		this.game.ship.destroy();
	    		this.destroy(index);
				return;
	    	}
    	}
	}
}

Asteroid.prototype.destroy = function(index) {
	//this.game.audio.explosion();
	this.game.addExplosion(this.posx, this.posy);
	
	var num_shape = this.game.asteroids[index].num_shape + 1;
	if(num_shape <= 2) {
		this.game.addAsteroids(2, num_shape, this.posx, this.posy);
	} else {
	    this.game.addAsteroids(1);
	}
	this.game.removeMoveableObject(this.game.asteroids, index);
}
