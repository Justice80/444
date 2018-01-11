OverDrive.Ball = (function(lib, canvas, context) {
	
	// Ball type
	lib.BallType = function(config) {
		this.handler = config.handler;
		this.collisionGroup = config.collisionGroup;
		this.sprite = new OverDrive.Game.Sprite(config.SpriteURI);
	}
	
	// Ball instance
	lib.Ball = function(config) {
		var self = this;
		
		this.type = config.type;
		this.scale = ball_sprite_scale;
		
		var size = { width: this.type.sprite.image.width * this.scale * config.boundingVolumeScale,
		height: this.type.sprite.image.height * this.scale * config.boundingVolumeScale };
		
		this.mBody = Matter.Bodies.rectangle(
			config.pos.x,
			config.pos.y,
			size.width,
			size.height,
			{
				isStatic: config.isStatic,
				isSensor: true,
				collisionFilter: { group : config.type.collisionGroup,
								   category: OverDrive.Game.CollisionModel.Ball.Category,
								   mask: OverDrive.Game.CollisionModel.Ball.Mask }
			}
		);
		
		
		Matter.Body.setMass(this.mBody, 0);
		this.mBody.hostObject = this;
		
		this.draw = function(){
			if(self.mBody) {
				context.save();
				
				var pos = self.mBody.position;
				
				context.translate(pos.x, pos.y);
				context.translate(-self.type.sprite.image.width * self.scale /2, -self.type.sprite.image.height * self.scale /2);
				self.type.sprite.draw(0, 0, self.scale);
				
				context.restore();
			}
		}
		
		this.drawBoundingVolume = function() {
			// Record path of mBody geometry
			context.beginPath();
			
			var vertices = self.mBody.vertices;
			context.moveTo(vertices[0].x, vertices[0].y);
			
			for(var j = 1; j < vertices.length; j++){
				context.lineTo(vertices[j].x, vertices[j].y);
			}
			
			context.lineTo(vertices[0].x, vertices[0].y);
			
			// Render geometry
			context.lineWidth = 1;
			context.strokeStyle = '#FFFFF';
			context.stroke();
		}
		
		
		//
		// Collision interface
		//
		
		this.doCollision = function(otherBody, env){
			otherBody.collideWithBall(this, {
				objA : env.objB,
				objB : env.objA,
				host : env.host
			});
		}
		
		this.collideWithPlayer = function(player, env) {
			console.log('hit ball');
			
			// TODO: move ball
		}
		
		this.collideWithProjectile = function(otherBall, env) {}
		this.collideWithBall = function(otherBall, env) {}
		
		// TODO: collide with goal? collide with pickup?
	}
}) ((OverDrive.Ball || {}). OverDrive.canvas, OverDrive.context);