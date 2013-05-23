var Game = function(canvas, canvas_width, canvas_height,debug) {
    this.canvas = document.getElementById(canvas);
    this.canvas_width = canvas_width;
    this.canvas_height = canvas_height;
    this.context = this.canvas.getContext("2d");
    this.debug_mode = debug;
    this.time = 0;
    this.last_frame = 0;
    this.shoots = new Array();
    this.asteroids = new Array();
    this.explosions = new Array(); 
    this.max_asteroids = 15;
    this.score = 0;
    this.spawn_score = 500;
    this.cumul_score = 0;
    
    this.img_background = new Image();
    this.img_background.src = 'images/outerspace.jpg';
    
    this.key_events = {left: false, right: false, up: false, shoot : false};
    
    this.addAsteroids = function(number, shape, posx, posy) {
        if((this.asteroids.length < this.max_asteroids && shape == undefined) || shape != undefined) {
            if(posx == undefined) {
                posx = -50;
            }
            
            if(posy == undefined) {
                posy = -50;
            }
            
            for(i=0; i<number; i++) {
                var asteroid_shape = 0;
                if(shape == undefined) {
                   asteroid_shape = Math.floor((Math.random() * 3))
                } else {
                   asteroid_shape = shape;
                }
                var asteroid = new Asteroid(this);
                asteroid.init(asteroid_shape, posx, posy);
                this.asteroids.push(asteroid);
            }
        }
    }
    
    this.addExplosion = function(posx, posy) {
        this.explosions.push(new Explosion(this, posx, posy));
    }
    
    this.addShip = function() {
        this.ship = new Ship(this);
        this.ship.init();
    }
    
    this.addShoot = function(shooter) {
        var shoot = new Shoot(this);
        shoot.init(shooter);
        this.shoots.push(shoot);
    }
    
    this.debug = function(name,value){

            if(this.debug_mode) {
                console.log(name + ' : ' + value);
            }
    }
    
    this.endGame = function() {
        this.shoots = new Array();
        this.asteroids = new Array();
        this.explosions = new Array();
        this.ship = undefined;
        this.saucer = undefined;
        clearInterval(this.interval);
        
        this.splashEnd();
    }
    
    this.init = function() {
        this.last_frame = Date.now();
    	this.canvas.width = canvas_width;
    	this.canvas.height = canvas_height;
    	
    	this.context.shadowBlur = 7;
		this.context.shadowOffsetX = 0;
		this.context.shadowOffsetY = 0;
		
        $("#loading").hide();
	    $("#game_canvas").show();
	    
	    this.splashScreen();
	}
	
	this.load = function() {
        var timeout = 0;
        var elems_to_be_loaded = 3 //(background image + fonts);
        var elems_loaded = 0;
        
        this.img_background.onload = function() { elems_loaded += 1 };
        
        var self = this;
        var idInterval = setInterval(function() {
            if($.fontAvailable('audiowideregular') && $.fontAvailable('orbitronregular') || timeout >= 200) {
                elems_loaded += 1;
            } else {
                timeout += 1;
            }
            
            if(elems_loaded == elems_to_be_loaded) {
                clearInterval(idInterval);
                self.init();
            }
            
        }, 10);
    }
	
	this.removeMoveableObject = function(tab_objects, index) {
        tab_objects[index] = undefined;
        tab_objects.splice(index, 1);
    }
    
    this.showGameInfos = function() {
        this.context.save();
        this.context.strokeStyle = '#FFFFFF';
        this.context.fillStyle = '#FFFFFF';
        this.context.font = "12px orbitronregular";
        this.context.fillText("Lives: " + (this.lives - 1) + "   -   Score: " + this.score, this.canvas_width - 300, 20);
        this.context.restore();
    }
	
	this.spawnSaucer = function() {
        this.saucer = new Saucer(this);
        this.saucer.init(0,0);
    }
	
	this.splashEnd = function() {
        this.context.save();
        this.context.drawImage(this.img_background,0,0);
        this.context.textAlign = "center";
        this.context.strokeStyle = '#ff9191';
        this.context.fillStyle = '#000000';
        this.context.font = '64px audiowideregular';
        this.context.strokeText("GAME OVER", this.canvas_width / 2, 200);
        this.context.strokeStyle = '#FFFFFF';
        this.context.fillStyle = '#FFFFFF';
        this.context.font = '24px orbitronregular';
        this.context.fillText("Score : "+this.score, this.canvas_width / 2, this.canvas_height / 2 + 50);
        
        var self = this;
        setTimeout(function() {
            self.context.font = '18px orbitronregular';
            self.context.fillText("Press spacebar to start", self.canvas_width / 2, self.canvas_height / 2 + 100);
            self.context.restore();
            document.onkeydown = function(evt) {
                if(evt.keyCode == 32) {
                    self.startGame();
                }
            }
        }, 2000);
        
    }
	
	this.splashScreen = function() {
		this.context.save();
		this.context.drawImage(this.img_background,0,0);
		this.context.textAlign = "center";
		this.context.strokeStyle = '#3fbfff';
		this.context.fillStyle = '#000000';
		this.context.font = '72px audiowideregular';
		this.context.strokeText("JS Asteroids", this.canvas_width / 2, 200);
		this.context.strokeStyle = '#FFFFFF';
		this.context.fillStyle = '#FFFFFF';
		this.context.font = '24px orbitronregular';
		this.context.fillText("Press spacebar to start", this.canvas_width / 2, this.canvas_height / 2 + 50);
		this.context.restore();
		
		var self = this;
		document.onkeydown = function(evt) {
            if(evt.keyCode == 32) {
                self.startGame();
            }
        }
	}
	
	this.startGame = function() {
		this.lives = 3;
		this.score = 0;
		
    	this.addShip();
    	this.addAsteroids(5);
    	
        var self = this;
    	this.interval = setInterval(function(){self.update();}, 10);
    	
    	document.onkeydown = function(evt) {
            if(evt.keyCode == 39) {
                self.key_events.right = true;
                self.key_events.left = false;
            }
            
            if(evt.keyCode == 37) {
                self.key_events.left = true;
                self.key_events.right = false;
            }
            
            if(evt.keyCode == 38) {
                self.key_events.up = true;
            }  
    
            if(evt.keyCode == 32) {
                self.key_events.shoot = true;
            }
        }
        
        document.onkeyup = function(evt) {
            if(evt.keyCode == 39) {
                self.key_events.right = false;
            }
            
            if(evt.keyCode == 37) {
                self.key_events.left = false;
            }
            
            if(evt.keyCode == 38) {
                self.key_events.up = false;
            }
            
            if(evt.keyCode == 32) {
                self.key_events.shoot = false;
                self.ship.can_fire = true;
            }
        }
    }
    
    this.update = function() {
        var current_frame = Date.now();
        this.time = (current_frame - this.last_frame);
        this.last_frame = current_frame;
        
        // RAZ de l'affichage
    	this.context.clearRect(0,0,this.canvas_width,this.canvas_height);
    	this.context.drawImage(this.img_background,0,0);
    	
    	this.ship.update();
    	
    	if(this.cumul_score > this.spawn_score) {
    		this.spawnSaucer();
    		this.cumul_score = 0;
    	}
    	
    	if(this.saucer != undefined) {
    	    this.saucer.update();
    	}
    	
    	for(i=0; i < this.asteroids.length; i++) {
    		var asteroid = this.asteroids[i];
    		
    		this.asteroids[i].update(i);
    	}
    	
    	this.updateLimitedTimeObjects(this.shoots);
    	this.updateLimitedTimeObjects(this.explosions);
    	
    	this.showGameInfos();
    	
    	if(this.lives == 0) {
        	this.endGame();
        }
    }
	
	this.updateLimitedTimeObjects = function(objects) {
		for(i=0; i < objects.length; i++) {
			objects[i].update();
			if(objects[i].life_time >= objects[i].max_life_time) {
				this.removeMoveableObject(objects, i);
			}
		}
	}
	
	this.updateScore = function(points) {
		this.score += points;
		if(this.saucer == undefined) {
			this.cumul_score += points;
		}
	}
}

$(document).ready(function(){
    var game = new Game("game_canvas", 700, 500,true);
    game.load();
});