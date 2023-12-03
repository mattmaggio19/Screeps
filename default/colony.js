
//Here is where we are putting colony logic, putting down construction sites.


//Radial pattern for construction sites,

// Import
// const colony = require('colony'); 

// Export


const harvesterCount = 4;
const upgraderCount = 3;
const builderCount = 2;
const extensionCount = 5;

class colony{

    constructor(roomName){
        this.roomName = roomName
        this.updateData();
    }

    updateData(){      
        this.overallAvailableEnergy = Game.rooms[ this.roomName].energyAvailable;
        this.energyCapacity = Game.rooms[ this.roomName].energyCapacityAvailable;
        this.harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        this.upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        this.builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        this.extensions = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_EXTENSION);
        this.extensionBuildSites = _.filter(Game.constructionSites, (constructionSite) => constructionSite.structureType == STRUCTURE_EXTENSION);

    }

    makeCreeps(){
    //spawn up to a number of each role
    if(this.upgraders.length < upgraderCount) {
        var newName = 'Upgrader' + Game.time;
        // console.log('Spawning new Upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'upgrader'}});
    }

       if(this.builders.length < builderCount) {
        var newName = 'Builder' + Game.time;
        // console.log('Spawning new Upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'builder'}});
    }

        if(this.harvesters.length < harvesterCount) {
            var newName = 'Harvester' + Game.time;
            // console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
        }   

    }

    handleConstructionSites() {
        var totalExtensions = this.extensions.length + this.extensionBuildSites.length;
    
        if((totalExtensions) < extensionCount) {
            var newName = 'Extension' + Game.time;
            var spawnPosition = Game.spawns['Spawn1'].pos;
    
            console.log('______________________________________________________________________');
            console.log('Finding a new extension construction site: ' + newName);
            
            var result = Game.rooms['W5N8'].createConstructionSite(spawnPosition.x - (3 * Math.random()) , spawnPosition.y  - (3* Math.random()), STRUCTURE_EXTENSION, newName);
            console.log('Extension construction site result: ' + result);
        }
    }
    


    log(){
        console.log('______________________________________________________________________');
        console.log('Reporting On colony in room: '+ this.roomName)
        console.log('Energy: ' + this.overallAvailableEnergy + '/' + this.energyCapacity);
        console.log('Harvesters: ' + this.harvesters.length + '/' + harvesterCount);
        console.log('Upgraders: ' + this.upgraders.length + '/' + upgraderCount);
        console.log('Builders: ' + this.builders.length + '/' + builderCount);
        console.log('Extensions: ' + this.extensions.length + '/' + extensionCount);
        console.log('Extension Build Sites: ' + this.extensionBuildSites.length);

    }    


}
module.exports = colony;