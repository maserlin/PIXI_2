function Game(){
  this.bg = null;
  this.bunny = null;
  this.spinButton = null;
  this.rect = null;
  this.reelset = null;
}
  
Game.prototype.createGameAssets = function(){
	// create a texture from an image path
	//var texture = PIXI.Texture.fromImage("im/bunny.png");
	
	// create a new Sprite using the texture
	this.bunny = new PIXI.Sprite(PIXI.Texture.fromImage("im/bunny.png"));

  // create a background
	this.bg = new PIXI.Sprite(PIXI.Texture.fromImage("im/bg.jpg"));
	var that = this;
    this.bg.resize = function(xscale,yscale){
        var size = getWindowBounds()
        that.bg.position.x = size.x/2;
        that.bg.position.y = size.y/2;
    }
	
	
	// center the sprites anchor point
	this.bunny.anchor.x = 0.5;
	this.bunny.anchor.y = 0.5;
	this.bg.anchor.x = 0.5;
	this.bg.anchor.y = 0.5;
	
	// stage should be global?
	stage.addChild(this.bg);
//	stage.addChild(this.bunny);


    var assets = ["im/spinButton.json","im/explosion.json","im/BlursNStills.json"];
    var loader = PIXI.loader;
    loader.add(assets);
    loader.once('complete',this.onAssetsLoaded);
    loader.load();
}


var reels_0 = [ [0,1,2,3,5,4,6,5,4,7,8,7,8,9,8,7,3,2,4,5,4,3,4,5,6,7,6,5,4,5],
                [0,1,2,3,5,4,6,5,4,7,8,7,8,9,8,7,3,2,4,5,4,3,4,5,6,7,6,5,4,5],
                [0,1,2,3,5,4,6,5,4,7,8,7,8,9,8,7,3,2,4,5,4,3,4,5,6,7,6,5,4,5],
                [0,1,2,3,5,4,6,5,4,7,8,7,8,9,8,7,3,2,4,5,4,3,4,5,6,7,6,5,4,5],
                [0,1,2,3,5,4,6,5,4,7,8,7,8,9,8,7,3,2,4,5,4,3,4,5,6,7,6,5,4,5] ];

Game.prototype.onAssetsLoaded = function(obj){
    
    // create a background
    this.bg = new GameBackground("im/bg.jpg");

    // Shuffle fake reels    
    for(var i=0;i<reels_0.length;++i){
        reels_0[i] = shuffleArray(reels_0[i]);
    }
    
    this.reelset = new Reelset(reels_0);
    
    this.spinButton = new SpinButton("Icon05_");
    this.spinButton.setAction(SpinButton.IDLE, this.onSpinReels);
    this.spinButton.setAction(SpinButton.SPIN, this.onStopReels);

    /*
    var explosionTextures = [];    
    for (var i=0; i < 26; i++) 
    {
        var texture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + ".png");
        explosionTextures.push(texture);
    };
    var explosion = new PIXI.extras.MovieClip(explosionTextures);
    explosion.position.x = explosion.position.y = 100;
    explosion.anchor.x = explosion.anchor.y = 0.5;
//    explosion.rotation = Math.random() * Math.PI;
    explosion.gotoAndPlay(0);
    stage.addChild(explosion);
    */
}

Game.prototype.onSpinReels = function(){
    console.log("call spin");
    
    game.reelset.spinReels([0,250,500,750,1000]);
    
}
Game.prototype.onStopReels = function(){
    console.log("call stop");
}


Game.prototype.addRectangle = function(x,y,w,h){
var gfx = new PIXI.Graphics();

gfx.beginFill(0xFFFF00);

// set the line style to have a width of 5 and set the color to red
gfx.lineStyle(5, 0xFF0000);

// draw a rectangle
gfx.drawRect(x,y,w,h);

stage.addChild(gfx);

this.rect = gfx;
}


