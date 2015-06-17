/**
 * Set up some basics for getting the game loading 
 * TODO show a splash screen with progress
 */
var game = null;
var gameWidth = 1136;
var gameHeight = 640;

/** Create a new instance of a pixi stage 
  * (Deprecated in V3: just delare a Container and bung everything in it)
  * TODO also make one for a console?
  */
var stage = new PIXI.Container();//Stage(0x000000,true);

// create a renderer instance.
var size = getWindowBounds();
var renderer = PIXI.autoDetectRenderer(size.x, size.y);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

/**
 * Window loaded: 
 * Make game Loader and listen for ASSETS_LOADED
 * Start rendering.
 */ 
document.addEventListener("DOMContentLoaded", function init(){
  
  var gameLoader = new GameLoader();
  Events.Dispatcher.addEventListener("ASSETS_LOADED", onAssetsLoaded);
  gameLoader.loadAssets(onAssetsLoaded);

  // Start rendering
  requestAnimationFrame( animate );

});

/**
 * Create a new Game, tell it the assets have loaded.
 * Get the game dimensions from the background sheet.
 * Start resizing. 
 */
function onAssetsLoaded(){
    game = new Game();
    game.onAssetsLoaded();
    
    gameWidth = game.bg.getBounds().width;
    gameHeight = game.bg.getBounds().height;
    
    window.addEventListener('resize', onWindowResize);
};


/**
 * Main render loop
 */ 
function animate() {
 
    requestAnimationFrame( animate );

    // just for fun, lets rotate mr rabbit a little
    //game.bunny.rotation += 0.1;
    //game.rect.rotation += -0.1;
    
    // render the stage   
    renderer.render(stage);
};

/**
 * Handle window resizing 
 */ 
function onWindowResize(Event){
    var size = getWindowBounds();
    renderer.resize(size.x,size.y);
    
    var scale = new Point(size.x / gameWidth, size.y / gameHeight)

    // Temp: center everything on the stage!
    for(var child=0; child<stage.children.length; ++child){
       if(stage.children[child].resize)stage.children[child].resize({size:size,scale:scale});
    } 
};

/**
 * UTILS: Get area of window
 */ 
function getWindowBounds(){ 
 var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return new Point(x,y);
};

/**
 * UTILS: Create Point class
 */ 
function Point(x, y){
  this.x = x;
  this.y = y;
};

/**
 * UTILS: Create Rectangle class
 */ 
function Rectangle(x,y,w,h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
};

/**
 * UTILS: Array randomiser
 */ 
function shuffleArray(array) {
    
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    
    return array;
};
