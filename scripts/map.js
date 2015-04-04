function mapInit(){
	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0x66FF99, true);

	// create a renderer instance.
	var renderer = PIXI.autoDetectRenderer(600, 400);

	// add the renderer view element to the DOM
	document.getElementById("map").appendChild(renderer.view);

	requestAnimFrame( animate );
	// create a texture from an image path
	var texture = PIXI.Texture.fromImage("images/toaster-empty.png", false);
	// create a new Sprite using the texture
	var toaster = new PIXI.Sprite(texture);

	// center the sprites anchor point
	toaster.anchor.x = 0.5;
	toaster.anchor.y = 0.5;

	// move the sprite t the center of the screen
	toaster.position.x = 200;
	toaster.position.y = 150;

	var bed_T = PIXI.Texture.fromImage("images/bed.png", false);
	var bedFocus_T  = PIXI.Texture.fromImage("images/bed-focus.png", false);
	var bed = new PIXI.Sprite(bed_T);
	bed.interactive = true;
	bed.anchor.y=1;
	bed.position.x = 0;
	bed.position.y = 400;

	bed.mouseover = function(mouseData){
	   bed.setTexture(bedFocus_T);
	}
	 
	bed.mouseout = function(mouseData){
	   bed.setTexture(bed_T);
	}


	// var graphics = new PIXI.Graphics();
	// graphics.beginFill(0x09F);
	// graphics.lineStyle(2, 0x03C);
	// graphics.drawRect(0, 0, 300, 200);
	// stage.addChild(graphics);
	// graphics.position.x = 50;
	// graphics.position.y = 200;

	stage.addChild(bed);
	stage.addChild(toaster);


	function animate() {

		requestAnimFrame( animate );

		// just for fun, lets rotate mr rabbit a little
		toaster.rotation += 0.1;
		if(stage.getMousePosition().x >=0 && stage.getMousePosition().y >=0  ) {
			toaster.position.x += (stage.getMousePosition().x - toaster.x)/10;
			toaster.position.y += (stage.getMousePosition().y - toaster.y)/10;
		}

	    // render the stage   
	    renderer.render(stage);
	}
}