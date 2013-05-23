var Ship = function(game) {
	this.game = game;
}

Ship.prototype = new Moveable();
Ship.prototype.constructor = Ship;

Ship.prototype.init = function() {
	
	Moveable.prototype.init.call(this);
	
	this.color = '#3fbfff';
	
	this.shape = new Array( [0,3,7,-7,-3,0],
				   			[-14,-5,6,6,-5,-14]);
	this.nodes_pos = new Array(this.shape[0].slice(0), this.shape[1].slice(0));
	this.poly_sides = this.shape[0].length;
    this.explodes_direction = new Array(325,90,215,180,120,45);
	this.explodes_angle = 0;
	this.explodes_shape = new Array( [3,4,-14,4,3],
                                     [9,11,0,-9,-9]);			   					 
	this.posx = this.max_posx / 2 - 4;
	this.posy = this.max_posy / 2;
	this.max_speed_turn = 20;
	this.max_velx = this.max_vely = 12;
    
    this.flame_visible = false;
	this.fire_rate = 300;
	this.shoot_timer = 0;
	this.can_fire = true;
	this.destroyed = false;
	this.explosion_timer = 0;
	this.max_explosion_timer = 1500;
	
	this.type = 'player';
}


Ship.prototype.setSpeedTurn = function(time) {
	if(this.game.key_events.left) {
	    this.speed_turn = 0 - this.max_speed_turn * time;
	    
	} else if(this.game.key_events.right) {
	    this.speed_turn = this.max_speed_turn * time;
	    
	} else {
	    this.speed_turn = 0;
	}
}


Ship.prototype.setAcceleration = function() {
	if(this.game.key_events.up) {
		this.accx = Math.sin((Math.PI * this.angle) / 180);
	    this.accy = Math.cos((Math.PI * this.angle) / 180);
	} else {
		this.accx = 0;
	    this.accy = 0;
	}
}

	
Ship.prototype.draw = function() {
	this.context.save();
	this.context.strokeStyle = this.color;
	this.context.fillStyle = this.fill_color;
	this.context.shadowColor = this.color;
	if(!this.destroyed) {
		this.drawShape();
    	if(this.flame_visible && Math.random() > 0.5) {
		    this.drawFlame();
	    }
	} else {
		this.drawShipDestroyed();
	}
	this.context.restore();
}


Ship.prototype.drawFlame = function() {
	this.context.beginPath();
	this.context.moveTo(5, 7);
	this.context.lineTo(3, 12);
	this.context.lineTo(2, 9);
	this.context.lineTo(0, 20);
	this.context.lineTo(-2, 9);
	this.context.lineTo(-3, 12);
	this.context.lineTo(-5, 7);
	this.context.closePath();
	this.context.stroke();
}


Ship.prototype.drawShipDestroyed = function() {
	var i = 0;
	while(i < this.explodes_direction.length) {
		this.context.save();
		this.context.beginPath();
		this.context.translate(this.nodes_pos[0][i],this.nodes_pos[1][i]);
		this.context.rotate((this.angle + this.explodes_angle)*Math.PI/180);
		this.context.moveTo(0, 0);
		this.context.lineTo(this.explodes_shape[0][i], this.explodes_shape[1][i]);
		this.context.stroke();
		this.context.closePath();
		this.context.restore();
		i += 1;
	}
}


Ship.prototype.update = function() {
	var time = this.game.time;
	
	if(!this.destroyed) {
		if(this.shoot_timer < this.fire_rate) {
	    	this.shoot_timer += time;
	   	}
	   	time = time / 60;
	   
	    this.setSpeedTurn(time);
	    this.setAngle();
	    this.setAcceleration();
	    this.setVelocity(time * 2);
	    this.move(time * 2, 2);
	    
	    this.updateCollisionPoints();
	    
	    var i = 0;
	    while(i < this.explodes_direction.length) {
	    	this.explodes_direction[i] += this.angle;
	    	if(this.explodes_direction[i] > 360) {
	    		this.explodes_direction[i] -= 360;
	    	} else if(this.explodes_direction[i] < 360) {
	    		this.explodes_direction[i] += 360;
	    	}
	    	i++;
	    }
	    
		if(this.game.key_events.up) {
			this.flame_visible = true;
			//this.game.audio.playThrust();
		} else {
			this.flame_visible = false;
			//this.game.audio.stopThrust();
		}
		
		if(this.game.key_events.shoot) {
	    	this.fire();
	    }
	    
	    this.detectCollision();
	    
	    this.draw();
	} else {
		if(this.explosion_timer < this.max_explosion_timer) {
	    	this.explosion_timer += time;
	    	var i = 0;
			while(i < this.explodes_direction.length) {
				this.nodes_pos[0][i] += Math.cos((Math.PI * this.explodes_direction[i]) / 180) * 0.3;
				this.nodes_pos[1][i] += Math.sin((Math.PI * this.explodes_direction[i]) / 180) * 0.3;
				i += 1;
			}
			this.explodes_angle += 0.5;
			this.draw();
	   	} else {
	   		if(this.game.key_events.left || this.game.key_events.right || this.game.key_events.up || this.game.key_events.shoot) {
	   			this.reInitPos();
	    	}
	    }
	}
}

Ship.prototype.fire = function() {
    if(this.shoot_timer >= this.fire_rate && this.can_fire) {
        this.game.addShoot(this);
        this.shoot_timer = 0;
        this.can_fire = false;
    }
}

Ship.prototype.destroy = function() {
	this.game.lives -= 1;
	this.destroyed = true;
	//this.game.audio.stopThrust();
	//this.game.audio.explosion();
}

Ship.prototype.reInitPos = function() {
	this.posx = this.max_posx / 2 - 4;
	this.posy = this.max_posy / 2;
	this.angle = 0;
	this.velx = this.vely = 0;
	this.nodes_pos = new Array(this.shape[0].slice(0), this.shape[1].slice(0));
	this.destroyed = false;
	this.explosion_timer = 0;
}

Ship.prototype.getShootAngle = function() {
    return this.angle;
}

Ship.prototype.detectCollision = function(index) {
	for(j=0; j < this.game.shoots.length; j++) {
		if(this.game.shoots[j].type == 'saucer_shoot') {
			if(this.isPointInPoly(this.game.shoots[j].posx, this.game.shoots[j].posy)) {
				this.destroy();
				this.game.removeMoveableObject(this.game.shoots, j);
				return;
			}
		}
	}
}
