var roleHarvester = {

    /** @param {Creep} creep   **/
    //** The harvester is a role for any creeps with a [move, work, carry] body. It is a general early game role that is replaced by extractors + carriers   **/
    run: function(creep) {       

        if(creep.store.getFreeCapacity() > 0) {      
            
            //First check if there is a nearby source and keep mining it if so.
            var nearbySources = creep.room.find(FIND_SOURCES, {
                filter: (source) => {
                    return Math.abs(source.pos.x - creep.pos.x) <= 1
                        && Math.abs(source.pos.y - creep.pos.y) <= 1
                }
            });

            if (nearbySources.length > 0){
                creep.harvest(nearbySources[0]);
            }
            else{
                var validRoomSources = [];
                var chosenRoomSource =[];
                var roomSources = creep.room.find(FIND_SOURCES);
                // var tarrain = Game.map.getRoomTerrain();
                for(var roomSource in roomSources){
                    // console.log(roomSources[roomSource].pos);
                    var openSpaces = 0;      
                    var minersCount = 0;
                    var x = roomSources[roomSource].pos.x;
                    var y = roomSources[roomSource].pos.y;
                    //Decide if the source is valid to consider based on how many screeps are occupying the adjacent spaces.
                    var terrain = creep.room.lookForAtArea(LOOK_TERRAIN,(y-1),(x-1),(y+1),(x+1),true); 
                    var miners  = creep.room.lookForAtArea(LOOK_CREEPS,(y-1),(x-1),(y+1),(x+1),true); 
    
                    // console.log(terrain);
                    for(var cell in terrain){
                        // console.log(terrain[cell].x,terrain[cell].y);  
                        // console.log(terrain[cell].terrain)  
                        if (terrain[cell].terrain != 'wall' )
                        {
                            openSpaces +=1;
                        }
                    }
                    for (var cell in miners){
                        if(miners[cell].creep != null){
                            minersCount += 1;
                        }                
                    }               
    
                    // console.log(openSpaces + '  Open spaces found');
                    // console.log(minersCount + '  Creeps mining found');
    
                    if(openSpaces  - minersCount > 0){
                        validRoomSources.push(roomSources[roomSource]);
                    }   
                }  
                    
               
                //Of the valid room sources, pick the closest one and go there.
                if(validRoomSources.length != 0){
                        console.log('Found : '+ validRoomSources.length+ '  validRoomSources')
                        
                        var bestDist = 1000000;
                        var bestIndex = 0;
                        for (var validRoom in validRoomSources){
                            //calculate the distance betweent the creep and if it is better than bestDist set the index to best Index
                            var dist = creep.room.findPath(creep.pos,validRoomSources[validRoom].pos)
                            // console.log(dist.length);
                            if(dist < bestDist){
                                bestDist = dist;
                                bestIndex = validRoom;
                            }
                        }
    
                        //Choose the best validRoomSource to use.
                        chosenRoomSource.push(validRoomSources[bestIndex]);
                        if(chosenRoomSource.length > 0 ){
                            // var Sources = creep.room.find(FIND_SOURCES);
                            if(creep.harvest(roomSources[0]) == ERR_NOT_IN_RANGE) {   
                                creep.moveTo(roomSources[0], {visualizePathStyle: {stroke: '#ffaa00'}});                    
                            }      
                        }                    
                    }
                    else{
                        //TODO GO TO A DIFFERENT ROOM.
                    }

            }

           
                    
            
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
            else{
                //TODO check global to find the nearest room with spawns and head there.
            }
        }
    }
};

module.exports = roleHarvester;