function GameBackground(imageUrl){
    PIXI.Sprite.call(this,PIXI.Texture.fromImage("im/bg.jpg"));
    
    this.anchor.x = this.anchor.y = 0.5;

    // Initial positioning
    var size = getWindowBounds()
    this.position.x = size.x/2;
    this.position.y = size.y/2;

   stage.addChild(this);
}
GameBackground.prototype = Object.create(PIXI.Sprite.prototype);
GameBackground.prototype.constructor = GameBackground;

GameBackground.prototype.resize = function(data){
    var size = getWindowBounds()
    this.position.x = size.x/2;
    this.position.y = size.y/2;
}

GameBackground.prototype.getBounds = function(){
    return new Rectangle(this.position.x, this.position.y, this.width, this.height);
}
