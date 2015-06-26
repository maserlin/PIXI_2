function Reelset(reels){
    this.container = new PIXI.Container();
    
    // Reel Background    
    var reelBg = new PIXI.Sprite(PIXI.Texture.fromImage("im/reelbg.png"));
    reelBg.position.x = 16;
    reelBg.position.y = 164;
    this.container.addChild(reelBg);
    
    // Reels
    this.reels = [];
    for(var reel in reels)
    {
        this.reels.push(new Reel(reel, reels[reel]));
    }
    for(reel in this.reels){
        this.container.addChild(this.reels[reel]);
    }

    this.container.pivot.x = this.container.width/2;
    this.container.pivot.y = this.container.height/2;
    //console.log(this.container)
    this.container.position.x = getWindowBounds().x/2;
    this.container.position.y = getWindowBounds().y/2;

    // Masking
    var thing = new PIXI.Graphics();
    thing.beginFill(0x000000,0.0);
    var start = new Point(18,170);
    var height = 426;
    var width = 826;
    thing.drawRect(start.x,start.y,width,height);
    
    // set mask
    this.container.addChild(thing);
    thing.isMask = true;
    this.container.mask = thing;
    
    // Reels Foreground
    var reelFg = new PIXI.Sprite(PIXI.Texture.fromImage("im/reelfg.png"));
    reelFg.position.x = 16;
    reelFg.position.y = 164;
    this.container.addChild(reelFg);

    this.container.resize = this.resize;
    stage.addChild(this.container);
    
    this.spinReels = this.spinReels.bind(this);
    this.stopReels = this.stopReels.bind(this);
    this.onReelStopped = this.onReelStopped.bind(this);
    Events.Dispatcher.addEventListener("REEL_STOPPED",this.onReelStopped);
    this.onReelSpinning = this.onReelSpinning.bind(this);
    Events.Dispatcher.addEventListener("REEL_SPINNING",this.onReelSpinning);
    
    // Add our reels to the global animation loop.
    this.animateReels = this.animateReels.bind(this);
}


Reelset.prototype.animateReels = function(){
    for(var reel in this.reels)this.reels[reel].animate();
}


Reelset.prototype.onReelSpinning = function(event){
    if(event.data == 4)
    {
        Events.Dispatcher.dispatchEvent(new Event("ALL_REELS_SPINNING"));
    }
}

Reelset.prototype.onReelStopped = function(event){
    if(event.data == 4)
    {
        globalTicker.remove(this.animateReels);
        
        this.reelMap = [];
        for(var reel in this.reels){
            this.reelMap.push(this.reels[reel].symbolsInView());
        }        
        Events.Dispatcher.dispatchEvent(new Event("ALL_REELS_STOPPED"));
    }
}

Reelset.prototype.getReelMap = function(){
    return this.reelMap;
}

Reelset.prototype.spinReels = function(timing){

    globalTicker.add(this.animateReels);

    var next = 0;
    var that = this;
    for(var t in timing){
       setTimeout(function(){
           //console.log(next)
           that.reels[next].spin();
           ++next 
       },timing[t]);      
    }
}

Reelset.prototype.stopReels = function(timing, positions){
    var that = this;
    var next = 0;
    for(var t in timing){
       setTimeout(function(){
           //console.log(next)
           that.reels[next].stop(positions[next]);
           ++next 
       },timing[t]);      
    }
}


/**
 * "this" is the Container which is being called, not Reelset 
 * @param {Object} data
 */
Reelset.prototype.resize = function(data){
    // Scale both by X to maintain aspect ratio
    this.scale.x = data.scale.x;
    this.scale.y = data.scale.x;
    // Reposition to center
    this.position.x = data.size.x/2;
    this.position.y = data.size.y/2;
}
