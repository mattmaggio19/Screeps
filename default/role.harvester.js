var roleHarvester = {

    /** @param {Creep} creep   **/
    //** The harvester is a role for any creeps with a [move, work, carry] body. It is a general early game role that is replaced by extractors + carriers   **/

    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            //Find a source that has less harvesters (and zero extractors) around it than it can support. 
            //Start in the room you are in, 
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.memory.targetDestination != null){
                if (creep.harvest(sources[creep.memory.targetDestination]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[creep.memory.targetDestination], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            //If we get this far, start searching adjacent rooms and get a list of mineable sources.
      
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
            //else look for the nearest structure in adjacent rooms.
        }
	}
};

module.exports = roleHarvester;