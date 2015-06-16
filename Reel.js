function Reel(reel, reelband){
    
    PIXI.Container.call(this);
    
    this.reelband = reelband;
    this.index = 0;
    this.id = reel;
    console.log("Created Reel id " + this.id + " symbols " + this.reelband);
    console.log("Symbols in view: " + this.symbolsInView());
    
    var ids = [];
    for(var i=-2; i<3; ++i){
        ids.push(this.getWrappedIndex(this.index+i));
    }

//    this.container = new PIXI.Container();
    this.position.x = (reel*162) + (reel*2);
    this.position.y = 0;
    
    for(var i=0; i<5; ++i){
        var s = new SpinSymbol(this.reelband[ids[i]]);
        s.position.x = 0;
        s.position.y = i * 140;
        this.addChild(s);
    }

    //stage.addChild(this.container);
}

Reel.prototype = Object.create(PIXI.Container.prototype);
Reel.prototype.constructor = Reel;


Reel.prototype.spin = function(){
    console.log("Reel " + this.id + " spin.")
}

Reel.prototype.symbolsInView = function(){
    var symbols = [];

    symbols.push(this.reelband[this.getWrappedIndex(this.index-1)]);
    symbols.push(this.reelband[this.getWrappedIndex(this.index)]);
    symbols.push(this.reelband[this.getWrappedIndex(this.index+1)]);
    
    return symbols;
}

Reel.prototype.getWrappedIndex = function(newIndex){
    return (newIndex + this.reelband.length) % this.reelband.length;
}
