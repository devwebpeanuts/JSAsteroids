var Saucer = function(game) {
    this.game = game;
}

Saucer.prototype = new Moveable();
Saucer.prototype.constructor = Saucer;

Saucer.prototype.init = function(posx, posy) {
    
    Moveable.prototype.init.call(this);
    
    this.color = '#B7FFB5';
    
    this.shape = new Array( [18,12,-12,-18,-6,6,3,-3,-6,6,18,-18],
                            [0,6,6,0,-6,-6,-12,-12,-6,-6,0,0]);
    this.poly_sides = this.shape[0].length;
    this.nodes_pos = new Array(this.shape[0].slice(0), this.shape[1].slice(0));
    this.posx = posx;
    this.posy = posy;
    this.direction = Math.random() * 360;
    this.speed = 0.8;
    this.speed_turn = Math.random();
    this.destroyed = false;
    this.fire_rate = 4000;
    this.shoot_timer = 0;
    this.time_before_change_direction = 4000;
    this.direction_timer = 0;
    this.shoot_direction = 0;
    this.score_points = 150;
    this.type = 'saucer';
}   


Saucer.prototype.draw = function() {
    this.context.save();
    this.context.strokeStyle = this.color;
    this.context.shadowColor = this.color;
    this.context.fillStyle = this.fill_color;
    this.drawShape();
    this.context.restore();
}


Saucer.prototype.update = function(index) {
    var time = this.game.time;
    
    this.shoot_timer += time;
    if(this.shoot_timer >= this.fire_rate) {
        this.fire();
    }
    
    this.direction_timer += time;
    if(this.direction_timer >= this.time_before_change_direction && !this.game.ship.destroyed) {
        this.updateDirection();
    }
    
    this.setVelocity(time / 10);
    this.move(1, 1);
    this.draw();
    
    this.updateCollisionPoints();
    this.detectCollision(index);
    
}

Saucer.prototype.detectCollision = function(index) {
    for(j=0; j < this.game.shoots.length; j++) {
        if(this.game.shoots[j].type == 'player_shoot') {
        	if(this.isPointInPoly(this.game.shoots[j].posx, this.game.shoots[j].posy)) {
	            this.destroyed = true;
	            this.game.removeMoveableObject(this.game.shoots, j);
	            this.destroy();
	            return;
	        }
        }
    }
    
    if(!this.game.ship.destroyed) {
        for(j=0; j < this.game.ship.poly_sides; j++) {
            if(this.isPointInPoly(this.game.ship.nodes_pos[0][j], this.game.ship.nodes_pos[1][j])) {
                this.game.ship.destroy();
                this.destroy();
                return;
            }
        }
    }
}

Saucer.prototype.setVelocity = function(time) {
	this.velx = Math.sin((Math.PI * this.direction) / 180) * this.speed * time;
    this.vely = Math.cos((Math.PI * this.direction) / 180) * this.speed * time;
}

Saucer.prototype.destroy = function(index) {
    //this.game.audio.explosion();
    this.game.addExplosion(this.posx, this.posy);
    this.game.updateScore(this.score_points);
    this.game.saucer = undefined;
}

Saucer.prototype.fire = function() {
    this.shoot_direction = this.getCorrectedAngleWith(this.game.ship);
    this.game.addShoot(this);
    this.shoot_timer = 0;
}


Saucer.prototype.getShootAngle = function() {
    return this.shoot_direction;
}

Saucer.prototype.updateDirection = function() {
	this.direction = this.getCorrectedAngleWith(this.game.ship);
	this.direction_timer = 0;
}
