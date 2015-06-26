function Game(){
    this.bg = null;
    this.bunny = null;
    this.spinButton = null;
    this.rect = null;
    this.reelset = null;

    this.onWinSplashComplete = this.onWinSplashComplete.bind(this);
    this.dataParser = new DataParser();
    var server = "http:\\\\10.32.10.24:8090\\PIXI";
    this.serverProxy = new ServerProxy(server, this.dataParser);
}

  
/**
 * TODO proper config  
 */
var reels_0 = [ [7,5,3,2,0,1,3,0,2,4,5,6,7,0,4,1,0,2,3,1,8,2,4,1,0,3,2,1,0,4,6,5,1],
                [1,4,5,1,6,5,0,2,1,0,3,4,0,2,3,7,6,1,4,0,3,1,2,6,7,2,1,0,4,1,0,0,3],
                [6,1,7,5,3,0,4,1,6,5,0,1,2,0,3,2,1,3,8,2,9,8,4,0,1,3,0,2,1,4,2,5,7],
                [0,3,2,4,1,0,3,2,0,4,3,0,1,0,2,3,0,7,6,5,1,6,5,7,2,1,0,4,1,0,0,2,1],
                [0,8,4,0,1,8,0,2,0,1,3,0,4,2,0,1,3,2,6,7,5,1,7,5,6,1,0,3,1,0,4,2,0] ];


Game.prototype.onAssetsLoaded = function(obj){
    
    // Shuffle fake reels    
    // for(var i=0;i<reels_0.length;++i){
        // reels_0[i] = shuffleArray(reels_0[i]);
    // }


    /*
     * Create a background which shoudl be in a lower layer
     */
    this.bg = new GameBackground(["im/bg.jpg","im/bg2.jpg"]);
    
    /*
     * This should be a gameScreen which has a reelset OR
     * build a reelset which can be passed to main game screen and 
     * freespins game screen.
     * It should be in a mid-level container layered up with 
     * winlines and win presentation layers (containers) so that 
     * everything resizes and scales together in proportion. 
     */
    this.reelset = new Reelset(reels_0);
    
    this.winCalculator = new WinCalculator();
    this.winSplash = new WinSplash();
    
    /*
     * This should be a whole console component in an upper layer. 
     */
    this.spinButton = new SpinButton("Icon05_");

        
    this.onSpinReels = this.onSpinReels.bind(this);
    this.onStopReels = this.onStopReels.bind(this);
    Events.Dispatcher.addEventListener("SPIN",this.onSpinReels);
    Events.Dispatcher.addEventListener("STOP",this.onStopReels);
    
    this.onReelsSpinning = this.onReelsSpinning.bind(this);
    Events.Dispatcher.addEventListener("ALL_REELS_SPINNING",this.onReelsSpinning);

    this.onReelsStopped = this.onReelsStopped.bind(this);
    Events.Dispatcher.addEventListener("ALL_REELS_STOPPED",this.onReelsStopped);

    //this.addExplosion()
};

Game.prototype.onReelsSpinning = function(){
        Events.Dispatcher.dispatchEvent(new Event("STOP"));
};

Game.prototype.onReelsStopped = function(){
    var wins = this.winCalculator.calculate(this.reelset.getReelMap());
    this.winSplash.show(wins);
    
    Events.Dispatcher.addEventListener("WIN_SPLASH_COMPLETE",this.onWinSplashComplete);    
};

Game.prototype.onWinSplashComplete = function(){
    console.log("Wins complete");   
    this.spinButton.setState(SpinButton.IDLE);
};


Game.prototype.onSpinReels = function(){
    console.log("call spin");
    
    
    var req = Object.create(null);
    req.code = "BET";
    req.stake = 200;
    req.winlines = 20;
    this.serverProxy.makeRequest(req);
    
    this.reelset.spinReels([0,200,400,600,800]);
    
};

Game.prototype.onStopReels = function(){
    var rands = [];
    for(var r=0; r<5; ++r){
        rand = Math.floor(Math.random() * reels_0[r].length);
        rands.push(rand);
    }
    console.log("call stop pos " + rands);
    //rands = [8,31,26,4,6];
    this.reelset.stopReels([0,200,400,600,800],rands);
};





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
};


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
};


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
};


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
};


