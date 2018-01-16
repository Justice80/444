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
		
		this.scale = config.scale;
		this.mBody = null;
		this.size = null;
		this.sprite = new OverDrive.Game.Sprite(
			config.spriteURI,
			
			function(w, h) {
				let size = { width: w * self.scale * config.boundingVolumeScale, height : h * self.scale * config.boundingVolumeScale };
				
				self.mBody = Bodies.rectangle(config.x, config.y, size.width, size.height);
				self.size = size;
				
				Body.setMass(self.mBody, config.mass);
				
				self.mBody.collisionFilter.group = config.collisionGroup;
				self.mBody.collisionFilter.category = OverDrive.Game.CollisionModel.NPC.Category;
				self.mBody.collisionFilter.mask = OverDrive.Game.CollisionModel.NPC.Mask;
				
				self.mBody.frictionAir = track_friction;
				
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
	
	this.doCollision = function(otherBody, env) {
	
      otherBody.collideWithBall(this, {
        
        objA : env.objB,
        objB : env.objA,
        host : env.host
      });
    }
	
	this.collideWithPlayer = function(otherPlayer, env) {
      
    }
	
	}
	
	return gamelib;
	
})((OverDrive.Game || {}), OverDrive.canvas, OverDrive.context);