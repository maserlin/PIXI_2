function Game(){
  this.bg = null;
  this.bunny = null;
  this.spinButton = null;
  this.rect = null;
  this.reelset = null;
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

        
    this.onSpinReels = this.onSpinReels.bind(this);
    this.onStopReels = this.onStopReels.bind(this);
    Events.Dispatcher.addEventListener("SPIN",this.onSpinReels);
    Events.Dispatcher.addEventListener("STOP",this.onStopReels);
    
    //this.addExplosion()
}

Game.prototype.onSpinReels = function(){
    console.log("call spin");
    
    this.reelset.spinReels([0,250,500,750,1000]);
    
}
Game.prototype.onStopReels = function(){
    console.log("call stop");
    var rands = [];
    for(var r=0; r<5; ++r){
        rand = Math.floor(Math.random() * reels_0[r].length);
        rands.push(rand);
    }
    
    this.reelset.stopReels([0,250,500,750,1000],rands);
}





/** *****************************************************************************************
 * Test method 
 */
Game.prototype.createGameAssets = function(){
    //this.createBunny();
    
    // create a background + quick and dirty resize
    this.bg = new PIXI.Sprite(PIXI.Texture.fromImage("im/bg.jpg"));
    var that = this;
    this.bg.resize = function(xscale,yscale){
        var size = getWindowBounds()
        that.bg.position.x = size.x/2;
        that.bg.position.y = size.y/2;
    }
    // center the sprites anchor point
    this.bg.anchor.x = 0.5;
    this.bg.anchor.y = 0.5;
    // stage should be global?
    stage.addChild(this.bg);

    // List assets and get them loaded
    var assets = ["im/spinButton.json","im/explosion.json","im/BlursNStills.json"];
    var loader = PIXI.loader;
    loader.add(assets);
    loader.once('complete',this.onAssetsLoaded);
    loader.load();
}


/** ****************************************************************************************************
 * Test method 
 */
Game.prototype.createBunny = function(){
    // create a texture from an image path
    //var texture = PIXI.Texture.fromImage("im/bunny.png");
    
    // create a new Sprite using the texture
    this.bunny = new PIXI.Sprite(PIXI.Texture.fromImage("im/bunny.png"));
    this.bunny.anchor.x = 0.5;
    this.bunny.anchor.y = 0.5;
    stage.addChild(this.bunny);
}


/** ****************************************************************************************************
 * Test method 
 */
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


/** ****************************************************************************************************
 * Test method 
 */
Game.prototype.addExplosion = function(){
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
}


