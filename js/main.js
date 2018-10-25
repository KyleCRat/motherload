//Game Variables
var ACC = 0.25;
var FRICTION = -0.05;
var count = 0;

var DIG_INTERVAL = 750;
var TILE_SIZE = 64;
var SKYHEIGHT = TILE_SIZE * 15;
var WORLDHEIGHT = 100;
var WORLDWIDTH = 50;

var TERMINAL_VELOCITY = 18;
var GRAVITY = 0.12;

var lastCall = 0;

var windowWidth = window.innerWidth - 150;
var windowHeight = window.innerHeight - 50;

var lastLoop = new Date;
var fps = 0;

//Create Canvas and Drawing Surface
var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");

drawingSurface.canvas.height = windowHeight;
drawingSurface.canvas.width = windowWidth;

//CSS UPDATE
document.getElementById("canvas").style.marginLeft = -canvas.width / 2 + 2 + 'px';
document.getElementById("canvas").style.marginTop = -canvas.height / 2 + 2 + 'px';

//Ship inventory
var INV_BASE_SIZE = 6;
var INV_UPGONE = 8;
var INV_UPGTWO = 12;
var INV_UPGTHREE = 15;
var INV_UPGFOUR = 20;
var INV_UPGFIVE = 30;
var INVENTORY_GUI = document.getElementById("inventory");

//Ship Fuel
var FUEL_PRICE = 1;
var FUEL_BASE_USE_RATE = 0.005; //fuel use per tick
var FUEL_MOVE_USE_RATE = 0.02;
var FUEL_DIG_USE_RATE = 0.03;
var FUEL_FLY_USE_RATE = 0.05;
var FUEL_BASE_SIZE = 50;
var FUEL_UPGONE = 100;
var FUEL_UPGTWO = 175;
var FUEL_UPGTHREE = 250;
var FUEL_UPGFOUR = 350;
var FUEL_UPGFIVE = 500;
var FUEL_GUI = document.getElementById("fuel");

//Ship Hull
var HULL_PRICE = 5;
var HULL_DAMAGE_MULT = 4;
var HULL_BASE_STRENGTH = 50;
var HULL_UPGONE = 100;
var HULL_UPGTWO = 175;
var HULL_UPGTHREE = 250;
var HULL_UPGFOUR = 350;
var HULL_UPGFIVE = 500;
var HULL_GUI = document.getElementById("hull");

//Ship Money Info
var STARTING_MONEY = 500;
var UPGONE_PRICE = 250;
var UPGTWO_PRICE = 1000;
var UPGTHREE_PRICE = 5000;
var UPGFOUR_PRICE = 10000;
var UPGFIVE_PRICE = 50000;
var MONEY_GUI = document.getElementById("money");

var FUEL_COST = 5;

//Minerals
var NOTMINERAL = 0;
var DIRT = 1;
var COAL = 2;
var COPPER = 3;
var SILVER = 4;
var GOLD = 5;
var PLATINUM = 6;
var DIAMOND = 7;

//Mineral Depths
var MINERAL_HEIGHT = 30 * TILE_SIZE;
var COAL_DEPTH = 15 * TILE_SIZE;
var COPPER_DEPTH = 20 * TILE_SIZE;
var SILVER_DEPTH = 35 * TILE_SIZE;
var GOLD_DEPTH = 45 * TILE_SIZE;
var PLATINUM_DEPTH = 60 * TILE_SIZE;
var DIAMOND_DEPTH = 80 * TILE_SIZE;

//Mineral Chances
var COAL_CHANCE = 11;
var COPPER_CHANCE = 10;
var SILVER_CHANCE = 9;
var GOLD_CHANCE = 9;
var PLATINUM_CHANCE = 8;
var DIAMOND_CHANCE = 7;

//Mineral values
var COAL_VALUE = 10;
var COPPER_VALUE = 15;
var SILVER_VALUE = 25;
var GOLD_VALUE = 40;
var PLATINUM_VALUE = 75;
var DIAMOND_VALUE = 150;

//Key Codes
var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;
var W = 87;
var A = 65;
var S = 83;
var D = 68;
var FLY = 32;

//KeyPress variables
var up = false;
var down = false;
var left = false;
var right = false;
var fly = false;

//Container Arrays
sprites = [];
tiles = [];

//Sprite Object
var spriteObject =
{
	//Source Info for spritesheet
	sourceX: 0,
	sourceY: 0,
	sourceWidth: 32,
	sourceHeight: 32,

	//Position and Height for sprite
	x: 0,
	y: 0,
	width: TILE_SIZE,
	height: TILE_SIZE,

	//Other Variables
	vx: 0,
	vy: 0,

	visible: true,
	rotation: 0,

	mineral: 0,
	mined: false,

	centerX: function()
	{
		return this.x + (this.width / 2);
	},
	centerY: function()
	{
		return this.y + (this.height / 2);
	},
	halfWidth: function()
	{
		return this.width / 2;
	},
	halfHeight: function()
	{
		return this.height / 2;
	}
};

//Create the background Sprite
var background = Object.create(spriteObject);
background.x = 0;
background.y = 0;
background.sourceWidth = 1600;
background.sourceHeight = 1920;
background.width = 1920 * TILE_SIZE / 32;
background.height = 3200 * TILE_SIZE / 32;
background.mineral = NOTMINERAL;
sprites.push(background);

var gameWorld =
{
	x: 0,
	y: 0,
	width: background.width,
	height: background.height
}

var camera =
{
	x: 0,
	y: 0,
	width: canvas.width,
	height: canvas.height
}

camera.x = (gameWorld.x + gameWorld.width / 2) - camera.width / 2;
camera.y = 0;

var player = Object.create(spriteObject);
player.x = (gameWorld.x + gameWorld.width / 2) - player.width / 2;
player.y = SKYHEIGHT - TILE_SIZE;
player.height = TILE_SIZE - 4;
player.width = TILE_SIZE - 4;
player.sourceX = 0;
player.sourceY = 1920;
player.sourceHeight = 32;
player.sourceWidth = 32;
player.mineral = NOTMINERAL;
player.money = STARTING_MONEY;
player.inventorySize = INV_BASE_SIZE;
player.inventory = [];
player.fuelSize = FUEL_BASE_SIZE;
player.fuel = FUEL_BASE_SIZE;
player.hullMax = HULL_BASE_STRENGTH;
player.hull = HULL_BASE_STRENGTH;
sprites.push(player);

var gasStation = Object.create(spriteObject);
gasStation.x = TILE_SIZE * 10;
gasStation.y = SKYHEIGHT - TILE_SIZE;
gasStation.sourceX = 32 * 49;
gasStation.sourceY = 1920;
gasStation.sourceWidth = 32;
gasStation.sourceHeight = 32;1568
gasStation.height = TILE_SIZE;
gasStation.width = TILE_SIZE;
sprites.push(gasStation);

var mineralDrop = Object.create(spriteObject);
mineralDrop.x = TILE_SIZE * 20;
mineralDrop.y = SKYHEIGHT - TILE_SIZE;
mineralDrop.sourceX = 32 * 48;
mineralDrop.sourceY = 1920;
mineralDrop.sourceWidth = 32;
mineralDrop.sourceHeight = 32;
mineralDrop.height = TILE_SIZE;
mineralDrop.width = TILE_SIZE;
sprites.push(mineralDrop);

var hullRepair = Object.create(spriteObject);
hullRepair.x = TILE_SIZE * 48;
hullRepair.y = SKYHEIGHT - TILE_SIZE;
hullRepair.sourceX = 32 * 47;
hullRepair.sourceY = 1920;
hullRepair.sourceWidth = 32;
hullRepair.sourceHeight = 32;
hullRepair.height = TILE_SIZE;
hullRepair.width = TILE_SIZE;
sprites.push(hullRepair);

//Load the imageSheet
var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "imgs/imgSheet.png";

createBoard();

function createBoard() {

	for(var h = SKYHEIGHT; h < (gameWorld.height); h += TILE_SIZE){

		for(var w = 0; w < (gameWorld.width); w += TILE_SIZE){

			var tempMineral;
			var minChance;

			tempMineral = DIRT; 

			if( COAL_DEPTH < h && h < (COAL_DEPTH + MINERAL_HEIGHT)){
				minChance = Math.ceil(Math.random() * 100);
				if(minChance < COAL_CHANCE) { tempMineral = COAL; }
			}

			if( COPPER_DEPTH < h && h < (COPPER_DEPTH + MINERAL_HEIGHT)){
				minChance = Math.ceil(Math.random() * 100);
				if(minChance < COPPER_CHANCE) { tempMineral = COPPER; }
			}

			if( SILVER_DEPTH < h && h < (SILVER_DEPTH + MINERAL_HEIGHT)){
				minChance = Math.ceil(Math.random() * 100);
				if(minChance < SILVER_CHANCE) { tempMineral = SILVER; }
			}

			if( GOLD_DEPTH < h && h < (GOLD_DEPTH + MINERAL_HEIGHT)){
				minChance = Math.ceil(Math.random() * 100);
				if(minChance < GOLD_CHANCE) { tempMineral = GOLD; }
			}

			if( PLATINUM_DEPTH < h && h < (PLATINUM_DEPTH + MINERAL_HEIGHT)){
				minChance = Math.ceil(Math.random() * 100);
				if(minChance < PLATINUM_CHANCE) { tempMineral = PLATINUM; }
			}

			if( DIAMOND_DEPTH < h && h < (DIAMOND_DEPTH + MINERAL_HEIGHT)){
				minChance = Math.ceil(Math.random() * 100);
				if(minChance < DIAMOND_CHANCE) { tempMineral = DIAMOND; }
			}

			var VOID_CHANCE = 7;

			minChance = Math.ceil(Math.random() * 100);
			if(minChance > VOID_CHANCE || h === SKYHEIGHT) { createTile(h,w,tempMineral); }

		}
	}
}

function createTile(y,x,mineral) {
	var tile = Object.create(spriteObject);
	tile.sourceY = 1920;
	tile.sourceX = mineral * 32;
	tile.sourceHeight = 32;
	tile.sourceWidth = 32;
	tile.x = x;
	tile.y = y;
	tile.width = TILE_SIZE;
	tile.height = TILE_SIZE;
	tile.mineral = mineral;
	tile.visible = true;
	tiles.push(tile);
	sprites.push(tile);
}

function fuelUpdate() {
	if((up && !down) || (fly && !down)){
		player.fuel -= FUEL_FLY_USE_RATE;
	}
	else if(left || right){
		player.fuel -= FUEL_MOVE_USE_RATE;
	}
	else if(down){
		player.fuel -= FUEL_DIG_USE_RATE;
	}
	else{
		player.fuel -= FUEL_BASE_USE_RATE;
	}
}

function inventoryAdd(mineral) {
	if(player.inventory.length < player.inventorySize){
		player.inventory.push(mineral);
	}
}

function startGame() {
	inventorySell();
}

function hullDamage() {
	if(player.vy > 6){
		player.hull -= (player.vy * HULL_DAMAGE_MULT);
	}
}

function invUpgrade() {
	switch(player.inventorySize){
		case INV_BASE_SIZE:
			if(player.money > UPGONE_PRICE){
				player.money -= UPGONE_PRICE;
				player.inventorySize = INV_UPGONE;
			}
			break;
		case INV_UPGONE:
			if(player.money > UPGTWO_PRICE){
				player.money -= UPGTWO_PRICE;
				player.inventorySize = INV_UPGTWO;
			}
			break;
		case INV_UPGTWO:
			if(player.money > UPGTHREE_PRICE){
				player.money -= UPGTHREE_PRICE;
				player.inventorySize = INV_UPGTHREE;
			}
			break;
		case INV_UPGTHREE:
			if(player.money > UPGFOUR_PRICE){
				player.money -= UPGFOUR_PRICE;
				player.inventorySize = INV_UPGFOUR;
			}
			break;
		case INV_UPGFOUR:
			if(player.money > UPGFIVE_PRICE){
				player.money -= UPGFIVE_PRICE;
				player.inventorySize = INV_UPGFIVE;
			}
			break;
	}
}

function fuelUpgrade() {
	switch(player.fuelSize){
		case FUEL_BASE_SIZE:
			if(player.money > UPGONE_PRICE){
				player.money -= UPGONE_PRICE;
				player.fuelSize = FUEL_UPGONE;
				player.fuel = player.fuelSize;
			}
			break;
		case FUEL_UPGONE:
			if(player.money > UPGTWO_PRICE){
				player.money -= UPGTWO_PRICE;
				player.fuelSize = FUEL_UPGTWO;
				player.fuel = player.fuelSize;
			}
			break;
		case FUEL_UPGTWO:
			if(player.money > UPGTHREE_PRICE){
				player.money -= UPGTHREE_PRICE;
				player.fuelSize = FUEL_UPGTHREE;
				player.fuel = player.fuelSize;
			}
			break;
		case FUEL_UPGTHREE:
			if(player.money > UPGFOUR_PRICE){
				player.money -= UPGFOUR_PRICE;
				player.fuelSize = FUEL_UPGFOUR;
				player.fuel = player.fuelSize;
			}
			break;
		case FUEL_UPGFOUR:
			if(player.money > UPGFIVE_PRICE){
				player.money -= UPGFIVE_PRICE;
				player.fuelSize = FUEL_UPGFIVE;
				player.fuel = player.fuelSize;
			}
			break;
	}
}

function hullUpgrade() {
	switch(player.hullMax){
		case HULL_BASE_STRENGTH:
			if(player.money > UPGONE_PRICE){
				player.money -= UPGONE_PRICE;
				player.hullMax = HULL_UPGONE;
				player.hull = player.hullMax;
			}
			break;
		case HULL_UPGONE:
			if(player.money > UPGTWO_PRICE){
				player.money -= UPGTWO_PRICE;
				player.hullMax = HULL_UPGTWO;
				player.hull = player.hullMax;
			}
			break;
		case HULL_UPGTWO:
			if(player.money > UPGTHREE_PRICE){
				player.money -= UPGTHREE_PRICE;
				player.hullMax = HULL_UPGTHREE;
				player.hull = player.hullMax;
			}
			break;
		case HULL_UPGTHREE:
			if(player.money > UPGFOUR_PRICE){
				player.money -= UPGFOUR_PRICE;
				player.hullMax = HULL_UPGFOUR;
				player.hull = player.hullMax;
			}
			break;
		case HULL_UPGFOUR:
			if(player.money > UPGFIVE_PRICE){
				player.money -= UPGFIVE_PRICE;
				player.hullMax = HULL_UPGFIVE;
				player.hull = player.hullMax;
			}
			break;
	}
}

function inventorySell() {
	for(var i = 0; i < player.inventory.length; i++){
		currentMin = player.inventory[i];

		switch(currentMin){
			case COAL: 
				player.money += COAL_VALUE;
				break;
			case COPPER:
				player.money += COPPER_VALUE;
				break;
			case SILVER:
				player.money += SILVER_VALUE;
				break;
			case GOLD:
				player.money += GOLD_VALUE;
				break;
			case PLATINUM:
				player.money += PLATINUM_VALUE;
				break;
			case DIAMOND:
				player.money += DIAMOND_VALUE;
				break;
		}
	}
	player.inventory = [];
}

function loadHandler()
{
	update();
}

function update()
{
	var thisLoop = new Date;
    fps = Math.floor(1000 / (thisLoop - lastLoop));
    lastLoop = thisLoop;

	window.requestAnimationFrame(update, canvas);

	fuelUpdate();

	//Keyboard Input
	if(up && !down){
		if(player.vy > -5.6){ 
			player.vy -= 0.25;
		}
		else{
			player.vy = -5.6;
		}
	}
	if(down && !up){
		
	}
	if(left && !right){
		if(player.vx > -8){ 
			player.vx -= 0.35;
		}
		else{
			player.vx = -5;
		}
	}
	if(right && !left){
		if(player.vx < 8){ 
			player.vx += 0.35;
		}
		else{
			player.vx = 8;
		}

	}
	if(fly){
		if(player.vy > -5.6){ 
			player.vy -= 0.25;
		}
		else{
			player.vy = -5.6;
		}
	}
	if(!left && !right){
		player.vx *= .7;
	}
	if(!up){
		if(player.vy < TERMINAL_VELOCITY){ 
			player.vy += GRAVITY;
		}
		else{
			player.vy = TERMINAL_VELOCITY;
		}
	}

	//Move the Player and Keep inside the gameworld
	player.x = Math.max(0, Math.min(player.x + player.vx, gameWorld.width - player.width));
	player.y = Math.max(0, Math.min(player.y + player.vy, gameWorld.height - player.height));

	//Center the camera
	camera.x = Math.floor(player.x + (player.width / 2) - (camera.width / 2));
	camera.y = Math.floor(player.y + (player.height / 2) - (camera.height / 2));

	//Camera's world boundaries
	if(camera.x < gameWorld.x)
	{
		camera.x = gameWorld.x;
	}
	if(camera.y < gameWorld.y)
	{
		camera.y = gameWorld.y;
	}
	if(camera.x + camera.width > gameWorld.x + gameWorld.width)
	{
		camera.x = gameWorld.x + gameWorld.width - camera.width;
	}
	if(camera.y + camera.height > gameWorld.height)
	{
		camera.y = gameWorld.height - camera.height;
	}

	//Collision Testing

	if(hitTestRect(player,gasStation)){
		if(player.fuel < player.fuelSize){
			var fuelToBuy = player.fuelSize - player.fuel;

			if(Math.floor(FUEL_PRICE * fuelToBuy) < player.money)
			{
				player.money -= Math.floor(FUEL_PRICE * fuelToBuy);
				player.fuel = player.fuelSize;
			}
		}
	}

	if(hitTestRect(player,hullRepair)){
		if(player.hull < player.hullMax){
			var hullToRepair = player.hullMax - player.hull;

			if(Math.floor(HULL_PRICE * hullToRepair) < player.money)
			{
				player.money -= Math.floor(HULL_PRICE * hullToRepair);
				player.hull = player.hullMax;
			}
			else {console.log("Not enough money");}
		}
		
		else {console.log("no damage");}
	}

	if(hitTestRect(player,mineralDrop)){
		inventorySell();
	}

	for(var i = 0; i < tiles.length; i++){
		var testTile = tiles[i];

		//if(testTile.x - Math.abs(player.x) < 64){
			//if(testTile.y - Math.abs(player.y) < 64){

				var blockTest = blockRect(player,testTile);

				if(blockTest !== "none"){
					if(blockTest === "top"){
						player.vy = .1;
					}

					if(blockTest === "bottom"){

						hullDamage();

						if(down && !up && !left && !right && !fly){

							var now = Date.now();

							if (lastCall + DIG_INTERVAL < now) {
								lastCall = now;

								player.x = testTile.x + 2;
								player.y = testTile.y - TILE_SIZE + 5;

								removeObject(testTile, sprites);
								removeObject(testTile, tiles);

								player.vy = 1;

								if(testTile.mineral !== DIRT){
									inventoryAdd(testTile.mineral);
								}
							}
						}
						player.vy = 0;
					}

					if(blockTest === "right"){

						if(Math.floor(player.y - 4) === Math.floor(testTile.y)){
							if(right && !left && (Math.floor(player.vy) === 0)){
								var now = Date.now();
							
								if (lastCall + DIG_INTERVAL < now) {
									lastCall = now;

									if(testTile.mineral !== DIRT){
										inventoryAdd(testTile.mineral);
									}

									removeObject(testTile, sprites);
									removeObject(testTile, tiles);

									player.vx = 0;
								}
							}
						}
					}

					if(blockTest === "left"){

						if(Math.floor(player.y - 4) === Math.floor(testTile.y)){
							if(left && !right && (Math.floor(player.vy) === 0)){
								var now = Date.now();
							
								if (lastCall + DIG_INTERVAL < now) {
									lastCall = now;

									if(testTile.mineral !== DIRT){
										inventoryAdd(testTile.mineral);
									}

									removeObject(testTile, sprites);
									removeObject(testTile, tiles);

									player.vx = 0;
								}
							}
						}
					}
				}
			//}
		//}
	}
	render();
}

function render()
{
	drawingSurface.clearRect(0,0, canvas.width, canvas.height);

	
	if(player.fuel <= 0){ FUEL_GUI.innerHTML = "Game Over"; }
	else {FUEL_GUI.innerHTML = "FUEL: " + Math.floor(player.fuel / player.fuelSize * 100) + "% Max: " + player.fuelSize;}

	if(player.hull <= 0){ HULL_GUI.innerHTML = "Game Over"; }
	else {HULL_GUI.innerHTML = "HULL: " + Math.floor(player.hull / player.hullMax * 100) + "%";}
	INVENTORY_GUI.innerHTML = "Inventory Space: " + player.inventory.length + "/" + player.inventorySize;
	MONEY_GUI.innerHTML = "MONEY: $" + player.money;
	document.getElementById("fps").innerHTML = "FPS: " + fps;

	drawingSurface.save();

	drawingSurface.translate(-camera.x, -camera.y);

	if(sprites.length !== 0){
		for(var i = 0; i < sprites.length; i++){
			var sprite = sprites[i];

			if(sprite.visible){

				drawingSurface.drawImage
				(
					image,
					sprite.sourceX, sprite.sourceY,
					sprite.sourceWidth, sprite.sourceHeight,
					Math.floor(sprite.x), Math.floor(sprite.y),
					sprite.width, sprite.height
				);
			}
		}
	}

	drawingSurface.restore();
}

//Add keyboard listeners
window.addEventListener("keydown", function(event) {
	switch(event.keyCode)
	{
	case LEFT:
	case A:
		left = true;
		break;
	case RIGHT:
	case D:
		right = true;
		break;
	case UP:
	case W:
		up = true;
		break;
	case DOWN:
	case S:
		down = true;
		break;
	case FLY:
		fly = true;
		break;
	}
}, false);

window.addEventListener("keyup", function(event) {
	switch(event.keyCode)
	{
	case LEFT:
	case A:
		left = false;
		break;
	case RIGHT:
	case D:
		right = false;
		break;
	case UP:
	case W:
		up = false;
		break;
	case DOWN:
	case S:
		down = false;
		break;
	case FLY:
		fly = false;
		break;
	}
}, false);

function hitTestRect(r1, r2) {
	return Math.abs(r1.centerX() - r2.centerX())
	< r1.halfWidth() + r2.halfWidth()
	&& Math.abs(r1.centerY() - r2.centerY())
	< r1.halfHeight() + r2.halfHeight();
}


function blockRect(r1, r2) {
	var collisionSide = "";

	var vx = r1.centerX() - r2.centerX();
	var vy = r1.centerY() - r2.centerY();

	var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
	var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

	if(Math.abs(vx) < combinedHalfWidths)
	{
		if(Math.abs(vy) < combinedHalfHeights)
		{

			var overlapX = combinedHalfWidths - Math.abs(vx);
			var overlapY = combinedHalfHeights - Math.abs(vy);

			if(overlapX >= overlapY)
			{
				if(vy > 0)
				{
					collisionSide = "top";

					r1.y = r1.y + overlapY;
				}
				else
				{
					collisionSide = "bottom";

					r1.y = r1.y - overlapY;
				}
			}
			else 
			{
				if(vx > 0)
				{
					collisionSide = "left";

					r1.x = r1.x + overlapX;
				}
				else
				{
					collisionSide = "right";

					r1.x = r1.x - overlapX;
				}
			}
		}
		else
		{
			collisionSide = "none";
		}
	}
	else
	{
		collisionSide = "none";
	}

	return collisionSide;
}

function removeObject(objectToRemove, array)
{
	var i = array.indexOf(objectToRemove);
	if ( i !== -1)
	{
		array.splice(i, 1);
	}
}

