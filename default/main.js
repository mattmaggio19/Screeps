var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var colony = require('colony');

module.exports.loop = function () {


    //Clear Creep Memory.
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            //console.log('Clearing non-existing creep memory:', name);
        }
    }

    
    //Colony level logic first get the list of rooms.
    var roomNameArray = [];  
    var colonyArray = []
    for (var spawnName in Game.spawns){
        var spawn = Game.spawns[spawnName];      
        if (!roomNameArray.includes(spawn.room.name)){
            roomNameArray.push(spawn.room.name);
            var colony1 = new colony(spawn.room.name);``
            colonyArray.push(colony1);
        }      
    }    

    //Use the colonies we created.
    for (let i = 0; i < colonyArray.length; i++){
        var thisColony = colonyArray[i];
        thisColony.log();
        thisColony.makeCreeps();
        thisColony.handleConstructionSites();
    }

      //Add roles. Tells the creeps in the game how to behave.
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }  
   

    //Make Towers function
    for( var tower in _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER)){
        if(tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
            else{
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }       
        }
    }
   
  
}