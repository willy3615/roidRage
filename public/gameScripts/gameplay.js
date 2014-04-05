Asteroids.screens['game-play'] = (function() {
	'use strict';
	
	var mouseCapture = false,
            myMouse = Asteroids.input.Mouse(),
            myKeyboard = Asteroids.input.Keyboard(),
            cancelNextRequest = false,
            moveShip = Asteroids.movement.ShipMovement(),
            myShip = Asteroids.objects.Ship(),
            smallUFO = Asteroids.objects.UFOSmall(),
            bigUFO = Asteroids.objects.UFOBig(),
            asteroids = Asteroids.objects.AsteroidList(),
            shotList = Asteroids.objects.ShotList(),
            collisions = Asteroids.collision.CollisionDetection(),
            myDrawnBackground = undefined,
            mySpaceShip = undefined,
            myDrawnBigUFO = undefined,
            myDrawnSmallUFO = undefined,
            roids = undefined,
            shot = undefined,
            shooting = false,
            lastTimeStamp = performance.now(),
            thrusterParticles1 = undefined,
            asterParticles1 = undefined,
            shipBoomParticles1 = undefined,
            thrusterParticles2 = undefined,
            asterParticles2 = undefined,
            shipBoomParticles2 = undefined,
            thrusterCount = 0,
            lastShot = 1;
                
                
            var toSpawn = 4;
	
	function initialize() {
		console.log('game initializing...');
		
		myShip.posX = 0.5 * Asteroids.size.width;
		myShip.posY = 0.5 * Asteroids.size.height;
		
		//thruster smoke
		thrusterParticles1 = Asteroids.particleSystem ({
			image : Asteroids.images['images/thrusterSmoke.png'],
			center: {x: 0, y: 0},
			sizeMed: 3,
			sizeStd: 1,
			speed: {mean: 100, stdev: 25},
			lifetime: {mean: 1, stdev: .5}
			},
			Asteroids.graphics
		);
		//number to be generated per action event
		thrusterParticles1.count = 5;
		
		//thruster spark
		thrusterParticles2 = Asteroids.particleSystem ({
			image : Asteroids.images['images/thrusterSpark.png'],
			center: {x: 0, y: 0},
			sizeMed: 3,
			sizeStd: 1,
			speed: {mean: 100, stdev: 25},
			lifetime: {mean: 1, stdev: .5}
			},
			Asteroids.graphics
		);
		thrusterParticles2.count =5;
		
		//asteroid smoke
		asterParticles1 = Asteroids.particleSystem({
			image : Asteroids.images['images/asteroidSmoke.png'],
			center: {x: 0, y: 0},
			sizeMed: 3,
			sizeStd: 1,
			speed: {mean: 100, stdev: 25},
			lifetime: {mean: 3, stdev: 1.5}
			},
			Asteroids.graphics
		);
		asterParticles1.count = 50;
		
		//asteroid spark
		asterParticles2 = Asteroids.particleSystem({
			image : Asteroids.images['images/asteroidSpark.png'],
			center: {x: 0, y: 0},
			sizeMed: 3,
			sizeStd: 1,
			speed: {mean: 100, stdev: 25},
			lifetime: {mean: 3, stdev: 1.5}
			},
			Asteroids.graphics);
		asterParticles2.count = 50;
		
		//explosion smoke
		shipBoomParticles1 = Asteroids.particleSystem({
			image : Asteroids.images['images/explosionSmoke.png'],
			center: {x: 0, y: 0},
			sizeMed: 3,
			sizeStd: 1,
			speed: {mean: 100, stdev: 25},
			lifetime: {mean: 3, stdev: .5}
			},
			Asteroids.graphics);
		shipBoomParticles1.count = 50;
		//ship spark
		shipBoomParticles2 = Asteroids.particleSystem({
			image : Asteroids.images['images/explosionSpark.png'],
			center: {x: 0, y: 0},
			sizeMed: 3,
			sizeStd: 1,
			speed: {mean: 100, stdev: 25},
			lifetime: {mean: 3, stdev: .5}
			},
			Asteroids.graphics);
		shipBoomParticles2.count = 50;
		
		
		myDrawnBackground = Asteroids.graphics.BackgroundDraw({
			image : Asteroids.images['images/background.png']
		});
		
		myDrawnBigUFO = Asteroids.graphics.ShipDraw({
			image : Asteroids.images['images/ufo.png'],
			width : smallUFO.width, height : bigUFO.height
		});
		
		myDrawnSmallUFO = Asteroids.graphics.ShipDraw({
			image : Asteroids.images['images/ufo.png'],
			width : smallUFO.width, height : smallUFO.height
		});
		
		mySpaceShip = Asteroids.graphics.ShipDraw({
			image : Asteroids.images['images/ship.png'],
			width : myShip.width, height : myShip.height
		});
                
                roids = Asteroids.graphics.RoidDraw({
			image : Asteroids.images['images/asteroid.png']
		});
                
                shot = Asteroids.graphics.ShotDraw({
			image : Asteroids.images['images/shot.png']
		});
                
                /*asteroids.push(Asteroids.objects.Asteroid(1));//takes the generation, after hit spawned will have a 2
                asteroids.push(Asteroids.objects.Asteroid(1));
                asteroids.push(Asteroids.objects.Asteroid(2));
                asteroids.push(Asteroids.objects.Asteroid(4));*/
                
                for(var i = 0; i < toSpawn; ++i)
                {
                    asteroids.list.push(Asteroids.objects.Asteroid(1));
                }
                
                console.log(asteroids.list[0].spin);
                
		
		
		myMouse.registerCommand('mousedown',function(e){
			});
		//
		// Create the keyboard input handler and register the keyboard commands
		
		
		//not sure why these aren't working
		myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, function(){
			//console.log('left');
			moveShip.turnLeft(myShip,Asteroids.elapsedTime);
			});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, function(){moveShip.turnRight(myShip,Asteroids.elapsedTime);});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_UP, function(){moveShip.booster(myShip,Asteroids.elapsedTime);});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_A, function(){moveShip.turnLeft(myShip,Asteroids.elapsedTime);});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_D, function(){moveShip.turnRight(myShip,Asteroids.elapsedTime);});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_W, function(){moveShip.booster(myShip,Asteroids.elapsedTime);});
                
                
       myKeyboard.registerCommand(KeyEvent.DOM_VK_V, function(){shotList.requestShot(myShip);});
		

		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			//
			// Stop the game loop by canceling the request for the next animation frame
			cancelNextRequest = true;
			//
			// Then, return to the main menu
			Asteroids.game.showScreen('main-menu');
		});
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		Asteroids.elapsedTime = time - Asteroids.lastTimeStamp;
		Asteroids.lastTimeStamp = time;
		update(Asteroids.elapsedTime);
		render(Asteroids.elapsedTime);
        
		if(!cancelNextRequest){
			requestAnimationFrame(gameLoop);
		}
	}
	

	
	function update(elapsedTime){
        lastShot += elapsedTime;
		myKeyboard.update();
        physics.drift(myShip,elapsedTime);
        physics.wrapAround(myShip);
        
        for (var i = 0; i < asteroids.list.length; i++)
        { 
            physics.drift(asteroids.list[i],elapsedTime);
            physics.wrapAround(asteroids.list[i]);
            physics.spin(asteroids.list[i], elapsedTime);
        }
        shotList.update(elapsedTime);
        
        
        //just for now
        bigUFO.seen = true;
        if(bigUFO.seen){
			bigUFO.update(elapsedTime,myShip);
		}
        smallUFO.seen = true
		if(smallUFO.seen){
			smallUFO.update(elapsedTime,myShip);
		}
        
        
        //check for collisons now that everything has been moved
        collisions.handleCollisions(myShip, asteroids);
        collisions.handleCollisions(shotList, asteroids);
        
        
        //ship thruster particles
        myShip.addParticles(thrusterParticles1);
        thrusterParticles1.update(elapsedTime/1000);
        myShip.addParticles(thrusterParticles2);
        thrusterParticles2.update(elapsedTime/1000);
        myShip.isBoosting = false;
        //asteroid particles
        asteroids.addParticles(asterParticles1);
        asterParticles1.update(elapsedTime/1000);
        asteroids.addParticles(asterParticles2);
        asterParticles2.update(elapsedTime/1000);
        //UFO particles
        if(smallUFO.die){
        	smallUFO.addParticles(shipBoomParticles1);
        	shipBoomParticles1.update(elapsedTime/1000);
        	smallUFO.addParticles(shipBoomParticles2);
        	shipBoomParticles1.update(elapsedTime/1000);
        	smallUFO.seen = false;
        }
        if(bigUFO.die){
        	bigUFO.addParticles(shipBoomParticles1);
        	bigBoomParticles1.update(elapsedTime/1000);
        	bigUFO.addParticles(shipBoomParticles2);
        	shipBoomParticles1.update(elapsedTime/1000);
        	bigUFO.seen = false;
        }

        shotList.removeDead();
        asteroids.handleHits();
	}
	
	function render(elapsedTime){

		Asteroids.graphics.clear();
		myDrawnBackground.draw();
		thrusterParticles1.render();
		thrusterParticles2.render();
		asterParticles1.render();
		asterParticles2.render();
		shipBoomParticles1.render();
		shipBoomParticles2.render();
		if(bigUFO.seen){
			myDrawnBigUFO.draw(bigUFO);
		}
		if(smallUFO.seen){
			myDrawnSmallUFO.draw(smallUFO);
		}
		mySpaceShip.draw(myShip);
                
        for (var i = 0; i < asteroids.list.length; i++)
        { 
            roids.draw(asteroids.list[i]);
        }
        if(typeof shotList.list !== 'undefined')
        {
            for (var i = 0; i < shotList.list.length; i++)
            { 
                shot.draw(shotList.list[i]);
            }
        }
	}
        
	function run() {
		
		
		Asteroids.lastTimeStamp = performance.now();
		//
		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
