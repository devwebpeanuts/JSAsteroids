var Moveable = function() {
	
}

Moveable.prototype.init = function() {
	this.color = '#FFFFFF';
	this.fill_color = '#000000';
	
	this.context = this.game.context;
	this.max_posx = this.game.canvas_width;
	this.max_posy = this.game.canvas_height;
	this.offscreen = 0;
	
	this.shape = new Array();
	this.nodes_pos = new Array();
	this.poly_sides = 0;
	
	this.posx = 0;
	this.posy = 0;
	this.accx = 0;
	this.accy = 0;
	this.velx = 0;
	this.vely = 0;
	this.angle = 0;
	this.speed_turn = 0;
	this.max_speed_turn = 0;
	this.max_vel = 0;
	
	this.type = '';
}


Moveable.prototype.setAcceleration = function() {
	
}


Moveable.prototype.setSpeedTurn = function() {
	
}


Moveable.prototype.setAngle = function() {
	 
	 this.angle += this.speed_turn;
	 
	 if(this.angle > 360) {
	     this.angle = 0;
	 } else if(this.angle < 0) {
	     this.angle = 360;
	 }
}


Moveable.prototype.setVelocity = function(time) {
	this.velx += this.accx * time;
	this.vely += this.accy * time;
	
	if(this.velx > this.max_velx) {
	    this.velx = this.max_velx;
	}
	if(this.velx < 0 - this.max_velx) {
	    this.velx = 0 - this.max_velx;
	}
	
	if(this.vely > this.max_vely) {
	    this.vely = this.max_vely;
	}
	if(this.vely < 0 - this.max_vely) {
	    this.vely = 0 - this.max_vely;
	}
}


Moveable.prototype.move = function(time, speed_reducer) {
	
	this.posx += this.velx * time / speed_reducer;
	this.posy -= this.vely * time / speed_reducer;
	
	if(this.posx - this.offscreen > this.max_posx) {
	    this.posx = 0 - this.offscreen;
	} else if (this.posx + this.offscreen < 0) {
	    this.posx = this.max_posx + this.offscreen;
	}
	
	if(this.posy  - this.offscreen > this.max_posy) {
	    this.posy = 0 - this.offscreen;
	} else if (this.posy + this.offscreen < 0) {
	    this.posy = this.max_posy + this.offscreen;
	}
}

Moveable.prototype.drawShape = function() {
	
	this.context.beginPath();
	this.context.translate(this.posx, this.posy);
	this.context.rotate(this.angle*Math.PI/180);
	this.context.moveTo(this.shape[0][i],this.shape[1][i]);
	var i = 0;
	while(i < this.shape[0].length) {
		this.context.lineTo(this.shape[0][i], this.shape[1][i]);
		i += 1;
	}
	
	this.context.closePath();
    this.context.fill();
    this.context.stroke();
}


Moveable.prototype.updateCollisionPoints = function() {
	var i = 0;
	while(i < this.shape[0].length) {
		this.nodes_pos[0][i] = (this.shape[0][i]*(Math.cos((Math.PI * this.angle) / 180)) - this.shape[1][i]*(Math.sin((Math.PI * this.angle) / 180))) + this.posx;
		this.nodes_pos[1][i] = (this.shape[0][i]*(Math.sin((Math.PI * this.angle) / 180)) + this.shape[1][i]*(Math.cos((Math.PI * this.angle) / 180))) + this.posy;
		i += 1;
	}
}


Moveable.prototype.isPointInPoly = function(point_x, point_y) {
	var i = 0;
	var j = this.poly_sides-1 ;
	var odd_nodes = false;
	
	for (i=0; i < this.poly_sides; i++) {
		if (this.nodes_pos[1][i]<point_y && this.nodes_pos[1][j]>=point_y || this.nodes_pos[1][j]<point_y && this.nodes_pos[1][i]>=point_y) {
      		if (this.nodes_pos[0][i] + (point_y-this.nodes_pos[1][i]) / (this.nodes_pos[1][j]-this.nodes_pos[1][i]) * (this.nodes_pos[0][j]-this.nodes_pos[0][i]) < point_x) {
        		odd_nodes = !odd_nodes;
        	}
        }
    	j=i;
  	}
	
	return odd_nodes;
}

Moveable.prototype.getAngleWith = function(object) {
	var delta_x = object.posx - this.posx;
	var delta_y = object.posy - this.posy;
	return Math.atan2(delta_x, -delta_y) * 180 / Math.PI;
}

Moveable.prototype.getCorrectedAngleWith = function(object) {
	var delta_x = object.posx + object.velx * this.game.time - this.posx;
	var delta_y = object.posy - object.vely * this.game.time - this.posy;
	return Math.atan2(delta_x, -delta_y) * 180 / Math.PI;
}
