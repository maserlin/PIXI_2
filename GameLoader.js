function GameLoader(){
    PIXI.loaders.Loader.call(this);
}

GameLoader.prototype = Object.create(PIXI.loaders.Loader.prototype);
GameLoader.prototype.constructor = GameLoader;

GameLoader.prototype.loadAssets = function(callbackOnDone){
    this.callback = callbackOnDone || this.callback;
    var assets = ["im/icon05.json","im/explosion.json","im/BlursNStills.json"];
    assets.push("im/bunny.png");
    assets.push("im/bg.jpg");
    this.add(assets);
    this.once('complete',this.onAssetsLoaded);
    this.on('progress', this.onProgress);
    this.load();
}


GameLoader.prototype.onProgress = function(data){
    console.log(data.progress);
}

GameLoader.prototype.onAssetsLoaded = function(data){
    for ( var obj in data.resources){
        console.log("Loaded " + obj);
    }
    this.callback();
}

GameLoader.prototype.callback = function(){
    console.log("Make callback");
}
