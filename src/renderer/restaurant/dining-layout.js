// One seating geometry shared by furniture, routing and each customer's place setting.
export const TABLE_RADIUS=1.03,CHAIR_RADIUS=1.38,TABLE_TOP=.955;
export const diningSeats=[Math.PI,-Math.PI/3,Math.PI/3].map((angle,index)=>{
 const ux=Math.cos(angle),uz=Math.sin(angle);
 return {index,dx:ux*CHAIR_RADIUS,dz:uz*CHAIR_RADIUS,ux,uz,heading:Math.atan2(-ux,-uz),plateX:ux*.64,plateZ:uz*.64};
});
export const seatApproach=seat=>({x:seat.x+seat.ux*.82,z:seat.z+seat.uz*.82});
export function placeSetting(table,seat){return {x:table.x+seat.plateX,y:TABLE_TOP+.024,z:table.z+seat.plateZ};}
export function dishItemOffset(seat,index,count){const columns=count===1?1:2,tangent=columns===1?0:(index%2-.5)*.26,radial=count<=2?0:(Math.floor(index/2)-.5)*.20;return {x:-seat.uz*tangent+seat.ux*radial,z:seat.ux*tangent+seat.uz*radial};}
