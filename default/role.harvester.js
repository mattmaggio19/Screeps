var roleHarvester = {

    /** @param {Creep} creep   **/
    //** The harvester is a role for any creeps with a [move, work, carry] body. It is a general early game role that is replaced by extractors + carriers   **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            var roomSources = creep.room.find(FIND_SOURCES);
            var 
            for(var roomSource in roomSources){
                
                //Decide if the source is valid to consider based on how many workers are nearby.
                
                if(creep.harvest(roomSources[roomSource]) == ERR_NOT_IN_RANGE) {   
                    console.log('I am going to source ' + roomSources[roomSource]);
                    creep.moveTo(roomSources[roomSource], {visualizePathStyle: {stroke: '#ffaa00'}});
                    
                }   

            }
            // //Basic go to the first source
            // if(creep.harvest(roomSources[0]) == ERR_NOT_IN_RANGE) {                
            //     creep.moveTo(roomSources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            // }
           
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;