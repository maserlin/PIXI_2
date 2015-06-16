/**
 * Set up some basics for getting the game loading and showing a splash screen 
 */
var gameLoader = null;
var game = null;
var gameWidth = 1136;
var gameHeight = 640;



// Window loaded: fire initial resize.
document.addEventListener("DOMContentLoaded", function init(){
  
  var gameLoader = new GameLoader();
  gameLoader.loadAssets(onAssetsLoaded);

/*
  game = new Game();
  game.createGameAssets();
  game.addRectangle(100,100,50,50);
*/
  // Start rendering
  requestAnimationFrame( animate );
  
//  onWindowResize();
});

/**
 * "this" is the GameLoader that made the call to this function 
 */
function onAssetsLoaded(){
    console.log(this);
    game = new Game();
    game.onAssetsLoaded();
    
    gameWidth = game.bg.getBounds().width;
    gameHeight = game.bg.getBounds().height;
    
    window.addEventListener('resize', onWindowResize);
};



// Listen for window resizing
//window.addEventListener('resize', onWindowResize);


// Create Point class
function Point(x, y){
  this.x = x;
  this.y = y;
};

// Create Rectangle class
function Rectangle(x,y,w,h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
};

// Util to get window area
function getWindowBounds(){ 
 var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return new Point(x,y);
};

// create an new instance of a pixi stage
var stage = new PIXI.Container();//Stage(0x000000,true);

// create a renderer instance.
var size = getWindowBounds();
var renderer = PIXI.autoDetectRenderer(size.x, size.y);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);
 
// 
function animate() {
 
  requestAnimationFrame( animate );

	    // just for fun, lets rotate mr rabbit a little
//	    game.bunny.rotation += 0.1;
//	    game.rect.rotation += -0.1;
		
	    // render the stage   
	    renderer.render(stage);
    
    //console.log("a")
};

// Handle window resizing
function onWindowResize(Event){
    var size = getWindowBounds();
    renderer.resize(size.x,size.y);
    
    var scale = new Point(size.x / gameWidth, size.y / gameHeight)

    // Temp: center everything on the stage!
    for(var child=0; child<stage.children.length; ++child){
       if(stage.children[child].resize)stage.children[child].resize({size,scale});
    } 
};

function shuffleArray(array) {
    
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    
    return array;
};
