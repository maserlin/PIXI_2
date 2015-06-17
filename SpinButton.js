function SpinButton(imageName){
    this.actions = [];
    this.state = SpinButton.IDLE;
    
    var spinButtonTextures = [];
    for(var i=0; i<62; i+=2)
    {
        var texture = PIXI.Texture.fromFrame(imageName + (i+1) + ".png");
        spinButtonTextures.push(texture);
    }
    this.spinButton = new AnimatedSymbol(spinButtonTextures, 5);
    this.spinButton.position.x = 100;
    this.spinButton.position.y = 100;
    this.spinButton.anchor.x = this.spinButton.anchor.y = 0.5;
    this.spinButton.animationSpeed = 0.2;
    this.spinButton.loop = false;
    this.spinButton.gotoAndPlay(0);
    this.spinButton.interactive = true;
    
    // Fix scope
    var that = this;
    this.spinButton.click = function(data){
        //"this" is the icon
        this.gotoAndPlay(0);
        that.performStateAction();
    }
    stage.addChild(this.spinButton);
};

    SpinButton.IDLE = 0;
    SpinButton.SPIN = 1;
    SpinButton.STOP = 2;

/**
 * Perform action and move to next state
 */
SpinButton.prototype.performStateAction = function(state){
    
    if(state != null)this.state = state;
    else{
        switch(this.state){
            case SpinButton.IDLE:
                this.state = SpinButton.SPIN;
                // Listened to by Game to provide timings
                Events.Dispatcher.dispatchEvent(new Event("SPIN"));
                break;
            case SpinButton.SPIN:
                this.state = SpinButton.IDLE;
                // Listened to by Game to provide timings and stopPositions
                Events.Dispatcher.dispatchEvent(new Event("STOP"));
                break;
            case SpinButton.STOP:
                this.state = SpinButton.IDLE;
                // Listened to by Game to provide timings and stopPositions
                Events.Dispatcher.dispatchEvent(new Event("STOP"));
                break;
        }
    }
}

SpinButton.prototype.setState = function(state){
    this.state = state;
};

