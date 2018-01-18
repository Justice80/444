OverDrive.Game = (function(gamelib, canvas, context) {
	
	gamelib.Ball = function(config) {
		
		// Matter.js module aliases
		var Engine = Matter.Engine,
			Render = Matter.Render,
			World = Matter.World,
			Bodies = Matter.Bodies,
			Body = Matter.Body,
			Composite = Matter.Composite;
			
		var self = this;
		
		this.goal = false;
		
		this.scale = config.scale;
		this.mBody = null;
		this.size = null;
		this.sprite = new OverDrive.Game.Sprite(
			config.spriteURI,
			
			function(w, h) {
				let size = { width: w * self.scale * config.boundingVolumeScale, height : h * self.scale * config.boundingVolumeScale };
				
				self.mBody = Bodies.circle(config.x, config.y, size.width, size.height);
				self.size = size;
				
				Body.setMass(self.mBody, 0.10);
				
				self.mBody.collisionFilter.group = config.collisionGroup;
				self.mBody.collisionFilter.category = OverDrive.Game.CollisionModel.Player.Category;
				self.mBody.collisionFilter.mask = OverDrive.Game.CollisionModel.Player.Mask;
				
				self.mBody.frictionAir = 0.01;
				
				self.mBody.hostObject = self;
				
				World.add(config.world, [self.mBody]);
				
				self.preUpdate = config.preUpdate;
				self.postUpdate = config.postUpdate;
			}
		);
	
	//
	//
	// testing draw functionalities
	//
	//
	this.draw = function() {
    
      if (this.mBody) {
        
        context.save();
        
        var pos = this.mBody.position;
        var theta = this.mBody.angle;
        
        context.translate(pos.x, pos.y);
        context.rotate(theta);
        context.translate(-this.sprite.image.width * this.scale / 2, -this.sprite.image.height * this.scale / 2);
        this.sprite.draw(0, 0, this.scale);
        
        context.restore();
      }
      
    }
    
    // Draw player bounding volume (Geometry of Matter.Body mBody)
    this.drawBoundingVolume = function(bbColour) {
      
      if (this.mBody) {
        
        // Render basis vectors
        
        // Get bi-tangent (y basis vector)
        var by = this.forwardDirection();
        
        // Calculate tangent (x basis vector) via perp-dot-product
        var bx = {
          
          x : -by.y,
          y : by.x
        }
        
        var pos = this.mBody.position;
        
        var w = this.sprite.image.width * this.scale / 2;
        var h = this.sprite.image.height * this.scale / 2;
      
        context.lineWidth = 2;
            
        context.strokeStyle = '#FF0000';
        context.beginPath();
        context.moveTo(pos.x, pos.y);
        context.lineTo(pos.x + bx.x * w, pos.y + bx.y * w);
        context.stroke();
        
        context.strokeStyle = '#00FF00';
        context.beginPath();
        context.moveTo(pos.x, pos.y);
        context.lineTo(pos.x + by.x * h, pos.y + by.y * h);
        context.stroke();
          
        
        
        // Record path of mBody geometry
        context.beginPath();

        var vertices = this.mBody.vertices;
        
        context.moveTo(vertices[0].x, vertices[0].y);
        
        for (var j = 1; j < vertices.length; ++j) {
        
          context.lineTo(vertices[j].x, vertices[j].y);
        }
        
        context.lineTo(vertices[0].x, vertices[0].y);
            
        // Render geometry
        context.lineWidth = 1;
        context.strokeStyle = bbColour;
        context.stroke();
		}
	}
	
	//
	// PHYSICS
	//
	
	this.forwardDirection = function() {
    
      if (this.mBody) {
      
        var theta = this.mBody.angle;
      
        return { x:-Math.sin(-theta), y:-Math.cos(-theta) };
      }
    }
    
    
    // Apply force at pos p on body 'this'
    this.applyForce = function(pos, direction) {
      Body.applyForce(this.mBody, pos, direction);
    }      
    
    
    
    this.applyTorque = function(pos, t) {
      
      var F = this.forwardDirection();
      var T = { x : -F.y, y : F.x };
                      
      player1.applyForce(pos, { x : T.x * t, y : T.y * t });
            
      // Apply inverse force to centre of mass to only induce rotation (TOO SPECIFIC TO OVERDRIVE???)
      player1.applyForce(player1.mBody.position, { x : T.x * -t, y : T.y * -t });
    }
	
	
	
	
	//
	// COLLISIONS
	//
	
	this.doCollision = function(otherBody, env) { 
	
	console.log('ball hit');
	
      otherBody.collideWithPlayer(this, {
        
        objA : env.objB,
        objB : env.objA,
        host : env.host
      });
    }
	
	this.collideWithPlayer = function(otherPlayer, env) {
		if(otherPlayer instanceof gamelib.Goal){
			otherPlayer.opposingPlayer.addPoints(100);
			this.goal = true;
		}
    }
	
	this.collideWithPath = function(path, env){ 
	
      path.collideWithPlayer(this, {
        
        objA : env.objB,
        objB : env.objA,
        host : env.host
      });
    }
	
	
	// POINTS FUNCTION (USELESS?)
	this.addPoints = function(scoreDelta) {
		console.log('ball hit pickup');
	}
	
	}
	
	return gamelib;
	
})((OverDrive.Game || {}), OverDrive.canvas, OverDrive.context);