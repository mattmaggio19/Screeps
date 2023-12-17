
//Here is where we are putting region logic. A region is a group of owned rooms (minimum 1)
// and their surrounding neutral rooms.




const ROLE_HARVESTOR = 'harvester'; //not harvestor XD
const ROLE_UPGRADER = 'upgrader';
const ROLE_BUILDER = 'builder';

const WORK_COST = 100;
const MOVE_COST = 50;
const CARRY_COST = 50;
const ATTACK_COST = 80;
const RANGED_ATTACK_COST = 150;
const HEAL_COST = 250;
const CLAIM_COST = 600;
const TOUGH_COST = 10;


const harvesterCountMax = 6;
const upgraderCountMax = 3;    
const builderCountMax = 1;
//This we need to define based on ROOM_CLR LEVEL.
const extensionCount = 5;


class region{
    constructor(roomName){
        this.roomName = roomName

        this.harvesterCount = 6;
        this.upgraderCount = 3;    
        this.builderCount = 1;
        this.extensionCount = 5;    

        this.updateData();
    }

    updateData(){      
        this.overallAvailableEnergy = Game.rooms[ this.roomName].energyAvailable;
        this.energyCapacity = Game.rooms[ this.roomName].energyCapacityAvailable;
        this.spawners = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_SPAWN);
        this.harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_HARVESTOR);
        this.upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_UPGRADER);
        this.builders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_BUILDER);
        this.extensions = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_EXTENSION);
        this.extensionBuildSites = _.filter(Game.constructionSites, (constructionSite) => constructionSite.structureType == STRUCTURE_EXTENSION);

        

    }

    reallocateCreeps(){
        // TODO reassign roles in case all harvesters die. Since we are only making worker bodys any of them can harvest
        // console.log("inside reallocateCreeps  ");
        if (this.harvesters.length < this.harvesterCount){
            //console.log("insufficent harvestor count");
            var reassignCounter = this.harvesterCount - this.harvesters.length;
            var nonHarvestors = _.filter(Game.creeps, (creep) => creep.memory.role !=ROLE_HARVESTOR)
            for (var creep in nonHarvestors){    
                if (reassignCounter > 0 ){
                    console.log("creep reassigned to harvestor" + creep.name);
                    nonHarvestors[creep].memory.role = ROLE_HARVESTOR;                                           
                    reassignCounter -= 1;
                }
            }          
        }
        //if there are builders and nothing to build reassign them to harvestors.

        //if there are buildings to build reassign a harvester to builders

        this.updateData();
    }

    makeCreeps(){    
        //TODO revisit this dynamic, purhaps room level or number of harvesters. 
        let numBodyParts = Math.round(this.overallAvailableEnergy /100 )
        let body = this.createWorkerBodies(ROLE_HARVESTOR, numBodyParts);
        let traitString = body.join(', ');
        console.log("GENERATED A WORKER BODY : "+ traitString)        

        //spawn up to a number of each role
        if(this.harvesters.length < this.harvesterCount) {
            var newName = 'Harvester' + Game.time;
            //console.log('Spawning new harvester: ' + newName);            
            var result  = Game.spawns['Spawn1'].spawnCreep(body, newName, 
            {memory: {role: ROLE_HARVESTOR}});
            //console.log('Spawning new harvester: ' + newName  + '  Result: '+ result.toString() ); 
        }   

        else if(this.upgraders.length < this.upgraderCount) {
            var newName = 'Upgrader' + Game.time;
            // console.log('Spawning new Upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(body, newName, 
                {memory: {role: ROLE_UPGRADER}});
        }

        else if(this.builders.length < this.builderCount) {
            var newName = 'Builder' + Game.time;
            // console.log('Spawning new Upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(body, newName, 
                {memory: {role: ROLE_BUILDER}});
        }   
    }

    handleConstructionSites() {
        var totalExtensions = this.extensions.length + this.extensionBuildSites.length;
    
        if((totalExtensions) < extensionCount) {
            var newName = 'Extension' + Game.time;
            var spawnPosition = Game.spawns['Spawn1'].pos;    
            console.log('______________________________________________________________________');
            console.log('Finding a new extension construction site: ' + newName);            
            var result = Game.rooms[this.roomName].createConstructionSite(spawnPosition.x - (3 * Math.random()) 
                        , spawnPosition.y  - (3* Math.random()), STRUCTURE_EXTENSION, newName);
            console.log('Extension construction site result: ' + result);
        }
    }
    
    createWorkerBodies(role, numBodyParts = 3){
    
        //stores the logic for each role to build a dynamic body.
        // overallAvailableEnergy is used from inside the region class. 
        // if(role == ROLE_HARVESTOR){        
        // }
        // else if ( role == ROLE_UPGRADER){
        // }
        // else if ( role == ROLE_BUILDER){
        // }

        var base = [MOVE, WORK, CARRY];  
        for(let i = base.length; i < numBodyParts; i++){         
            var randi = Math.random();   
            if(base.length < 6 ){
                if (randi > 0 && randi <= 0.33){ base.push(MOVE); }
                else if (randi > 0.33 && randi <= 0.66){ base.push(WORK); }
                else if (randi > 0.66 && randi <= 1){ base.push(CARRY); } 
            }   
            else{ return base; }               
        }
        return base;
    }


    log(){
        console.log('______________________________________________________________________');
        console.log('Reporting On Region based in room: '+ this.roomName)
        console.log('Energy: ' + this.overallAvailableEnergy + '/' + this.energyCapacity);
        console.log('Harvesters: ' + this.harvesters.length + '/' + this.harvesterCount);
        console.log('Upgraders: ' + this.upgraders.length + '/' + this.upgraderCount);
        console.log('Builders: ' + this.builders.length + '/' + this.builderCount);
        console.log('Extensions: ' + this.extensions.length + '/' + extensionCount);
        console.log('Extension Build Sites: ' + this.extensionBuildSites.length);

    }    


}
module.exports = region;