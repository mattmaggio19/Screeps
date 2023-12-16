
//Here is where we are putting region logic. A region is a group of owned rooms (minimum 1)
// and their surrounding neutral rooms.



const harvesterCount = 4;
const upgraderCount = 1;
const builderCount = 0;
const extensionCount = 5;

class region{
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

    reallocateCreeps(){
        // reassign roles in case all harvesters die. Since we are only making worker bodys any of them can harvest
        // console.log("inside reallocateCreeps  ");
        if (this.harvesters.length < harvesterCount){
            console.log("insufficent harvestor count");
            var reassignCounter = harvesterCount - this.harvesters.length;
            var nonHarvestors = _.filter(Game.creeps, (creep) => creep.memory.role != 'harvester')
            for (var creep in nonHarvestors){
                if (reassignCounter > 0 ){
                    console.log("creep reassigned to harvestor");
                    creep.memory.role = 'harvester';
                    reassignCounter -= 1;
                }
            }          
        }
        this.updateData();
    }

    makeCreeps(){
    //spawn up to a number of each role
    if(this.harvesters.length < harvesterCount) {
        var newName = 'Harvester' + Game.time;
        //console.log('Spawning new harvester: ' + newName);
        var result  = Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
        {memory: {role: 'harvester'}});
        //console.log('Spawning new harvester: ' + newName  + '  Result: '+ result.toString() ); 
    }   

    else if(this.upgraders.length < upgraderCount) {
        var newName = 'Upgrader' + Game.time;
        // console.log('Spawning new Upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'upgrader'}});
    }

    else if(this.builders.length < builderCount) {
        var newName = 'Builder' + Game.time;
        // console.log('Spawning new Upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'builder'}});
    }   

    }

    handleConstructionSites() {
        var totalExtensions = this.extensions.length + this.extensionBuildSites.length;
    
        if((totalExtensions) < extensionCount) {
            var newName = 'Extension' + Game.time;
            var spawnPosition = Game.spawns['Spawn1'].pos;    
            console.log('______________________________________________________________________');
            console.log('Finding a new extension construction site: ' + newName);            
            var result = Game.rooms['W5N8'].createConstructionSite(spawnPosition.x - (3 * Math.random()) 
                        , spawnPosition.y  - (3* Math.random()), STRUCTURE_EXTENSION, newName);
            console.log('Extension construction site result: ' + result);
        }
    }
    


    log(){
        console.log('______________________________________________________________________');
        console.log('Reporting On Region based in room: '+ this.roomName)
        console.log('Energy: ' + this.overallAvailableEnergy + '/' + this.energyCapacity);
        console.log('Harvesters: ' + this.harvesters.length + '/' + harvesterCount);
        console.log('Upgraders: ' + this.upgraders.length + '/' + upgraderCount);
        console.log('Builders: ' + this.builders.length + '/' + builderCount);
        console.log('Extensions: ' + this.extensions.length + '/' + extensionCount);
        console.log('Extension Build Sites: ' + this.extensionBuildSites.length);

    }    


}
module.exports = region;