function SpinSymbol(id){
    var iconTextures = [];
    for(var i=0; i<12; ++i)
    {
        var texture;
        if(i<10) texture = PIXI.Texture.fromFrame("Icon_0" + i + ".png");
        else texture = PIXI.Texture.fromFrame("Icon_" + i + ".png");
        iconTextures.push(texture);
    }
    this.blurOffset = i;

    for(var i=0; i<12; ++i)
    {
        var texture;
        if(i<10) texture = PIXI.Texture.fromFrame("Blur_Icon_0" + i + ".png");
        else texture = PIXI.Texture.fromFrame("Blur_Icon_" + i + ".png");
        iconTextures.push(texture);
    }

    PIXI.extras.MovieClip.call(this, iconTextures);
//    this.movie = new PIXI.extras.MovieClip(iconTextures);
    this.id = id;
    this.gotoAndStop(this.id);
}

SpinSymbol.prototype = Object.create(PIXI.extras.MovieClip.prototype);
SpinSymbol.prototype.constructor = SpinSymbol;

SpinSymbol.prototype.setId = function(id){
    
    if(this.id != id)
    {
        this.id = id;
        this.gotoAndStop(this.id);
    }
}
