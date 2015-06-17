function Reel(reel, reelband){
    
    PIXI.Container.call(this);

    this.reelband = reelband;
    this.newReelband = reelband;
    this.index = 0;
    this.id = reel;
    this.cueStop = false;
    this.speed = (140/5*2)/(1000/30);
    this.setSymbols = 0;

    console.log("Created Reel id " + this.id + " symbols " + this.reelband);
    console.log("Symbols in view: " + this.symbolsInView());
    
    var ids = this.symbolsOnReel();
    console.log(this.id + " " + ids)
    this.position.x = (reel*162) + (reel*2);
    this.position.y = 0;
    this.symbols = [];
    
    for(var i=0; i<5; ++i){
        var s = new SpinSymbol(ids[i]);
        s.position.x = 0;
        s.position.y = i * 140;
        this.addChild(s);
        this.symbols.push(s);
        //console.log("s at " + s.position.y)
    }
    this.frameTop = this.symbols[1].position.y;
    
    /*
     * TODO Run ticker externally to theis class, probably in Game.
     * Probably make a whole game animation loop thing?
     */
    this.ticker = PIXI.ticker.shared;
    // Set this to prevent starting this ticker when listeners are added.
    // By default this is true only for the PIXI.ticker.shared instance.
    this.ticker.autoStart = false;
    // FYI, call this to ensure the ticker is stopped. It should be stopped
    // if you have not attempted to render anything yet.
    this.ticker.stop();
    // Call this when you are ready for a running shared ticker.
    // this.ticker.start();
        //stage.addChild(this.container);
        var that = this;
            this.ticker.add(function (time) {
                that.animate(time);
    });
}

Reel.prototype = Object.create(PIXI.Container.prototype);
Reel.prototype.constructor = Reel;

Reel.IDLE = 0;
Reel.STARTING = 1;
Reel.SPINNING = 2;
Reel.SETTING = 3;
Reel.STOPPING = 4;
Reel.prototype.state = Reel.IDLE;

/**
 * SPIN called externally to start reel 
 */
Reel.prototype.spin = function(){
    console.log("Reel " + this.id + " spin.")
    this.cueStop = false;
    if(this.state == Reel.IDLE){
        console.log("STARTING");
        this.ticker.start();
        this.state = Reel.STARTING;
    }
}

/**
 * STOP called externally to stop reel at stopPos 
 */
Reel.prototype.stop = function(stopPos, newReelband){
    console.log("Reel " + this.id + " stop at " + stopPos);
    this.stopPos = stopPos;
    this.newReelband = newReelband || this.reelband;
    
    /*
     * Set the reel and stop it in SPINNING mode
     * Does nothing until reel is SPINNING
     */
    this.cueStop = true;
}

/**
 * Animation loop: Run via global timer for now:
 * TODO run aniamtion loop externally to this class 
 */
Reel.prototype.animate = function(time){

    switch(this.state)
    {
        case Reel.IDLE:
            break;

        case Reel.STARTING:
            this.lift();
            break;

        case Reel.SPINNING:
            this.spinReel();
            if(this.cueStop){
                this.state = Reel.SETTING;
            }
            break;

        case Reel.SETTING:
            this.setReel();
            break;
 
        case Reel.STOPPING:
            this.stopReel();
            break;    
    }
}

/**
 * Animation loop: set the new symbols to come in  
 */
Reel.prototype.setReel = function(){
    // Move reel as normal
    for(var s in this.symbols){
        this.symbols[s].position.y += this.speed;
    }
    
    // If resetting, change symbols but start to feed in new ones    
    if(this.symbols[0].position.y >= this.frameTop){
        var offset = this.symbols[0].position.y;
        this.index = this.getWrappedIndex(this.index+1);
        var ids = this.symbolsOnReel();
        
        for(var s in this.symbols){
            this.symbols[s].position.y -= offset;
            this.symbols[s].setId(ids[s]);
        }
        
        // -- new symbols
        ++this.setSymbols;
        switch(this.setSymbols){
            case 1:
            this.symbols[0].setId(this.newReelband[this.getWrappedIndex(this.stopPos+2)]);
            break;
            case 2:
            this.symbols[0].setId(this.newReelband[this.getWrappedIndex(this.stopPos+1)]);
            this.symbols[1].setId(this.newReelband[this.getWrappedIndex(this.stopPos+2)]);
            break;
            case 3:
            this.symbols[0].setId(this.newReelband[this.getWrappedIndex(this.stopPos)]);
            this.symbols[1].setId(this.newReelband[this.getWrappedIndex(this.stopPos+1)]);
            this.symbols[2].setId(this.newReelband[this.getWrappedIndex(this.stopPos+2)]);
            break;
            case 4:
            this.symbols[0].setId(this.newReelband[this.getWrappedIndex(this.stopPos-1)]);
            this.symbols[1].setId(this.newReelband[this.getWrappedIndex(this.stopPos)]);
            this.symbols[2].setId(this.newReelband[this.getWrappedIndex(this.stopPos+1)]);
            this.symbols[3].setId(this.newReelband[this.getWrappedIndex(this.stopPos+2)]);
            break;
            case 5:
            this.symbols[0].setId(this.newReelband[this.getWrappedIndex(this.stopPos-2)]);
            this.symbols[1].setId(this.newReelband[this.getWrappedIndex(this.stopPos-1)]);
            this.symbols[2].setId(this.newReelband[this.getWrappedIndex(this.stopPos)]);
            this.symbols[3].setId(this.newReelband[this.getWrappedIndex(this.stopPos+1)]);
            this.symbols[4].setId(this.newReelband[this.getWrappedIndex(this.stopPos+2)]);
            this.state = Reel.STOPPING;
            break;
        }
    }
}

/**
 * TODO send event when stopped and stop ticker externally from this class 
 */
Reel.prototype.stopReel = function(){
    for(var s in this.symbols){
        this.symbols[s].position.y += this.speed;
    }

    if(this.symbols[0].position.y >= this.frameTop){

        var offset = this.symbols[0].position.y;
        this.index = this.getWrappedIndex(this.index+1);
        this.reelband = this.newReelband;
        var ids = this.symbolsOnReel();
        for(var s in this.symbols){
            this.symbols[s].position.y -= offset;
            this.symbols[s].setId(ids[s]);
        }

        this.state = Reel.IDLE;
        if(this.id == 4)this.ticker.stop();
    }
    
}


/**
 * Animation loop: Normal spinning from indexPos to indexPos 
 */
Reel.prototype.spinReel = function(){
    for(var s in this.symbols){
        this.symbols[s].position.y += this.speed;
    }
    
    if(this.symbols[0].position.y >= this.frameTop){
        var offset = this.symbols[0].position.y;
        this.index = this.getWrappedIndex(this.index+1);
        var ids = this.symbolsOnReel();
        for(var s in this.symbols){
            this.symbols[s].position.y -= offset;
            this.symbols[s].setId(ids[s]);
        }
    }
}

/**
 * Animation loop: Lifting reel to start
 * TODO interpolated positions 
 */
Reel.prototype.lift = function(){
    for(var s in this.symbols){
        --this.symbols[s].position.y;
    }
    if(this.symbols[1].position.y < this.frameTop/3*2){
        this.state = Reel.SPINNING;
    }
}

/**
 * Symbols showing on reel 
 */
Reel.prototype.symbolAt = function(index, reelband){
    var pos = (index + reelband.length) % reelband.length;
    return reelband[pos];
}

/**
 * Symbols showing on reel 
 */
Reel.prototype.symbolsInView = function(){
    var symbols = [];

    symbols.push(this.reelband[this.getWrappedIndex(this.index+1)]);
    symbols.push(this.reelband[this.getWrappedIndex(this.index)]);
    symbols.push(this.reelband[this.getWrappedIndex(this.index-1)]);
    
    return symbols;
}

/**
 * All 5 symbols on reel 
 */
Reel.prototype.symbolsOnReel = function(){
    var symbols = [];

    symbols.push(this.reelband[this.getWrappedIndex(this.index+2)]);
    symbols = symbols.concat(this.symbolsInView());
    symbols.push(this.reelband[this.getWrappedIndex(this.index-2)]);
    
    return symbols;
}

/**
 * Returns index wrapped to length of reel 
 */
Reel.prototype.getWrappedIndex = function(newIndex){
    return (newIndex + this.reelband.length) % this.reelband.length;
}
