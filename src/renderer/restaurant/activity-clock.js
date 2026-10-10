// Shared elapsed-time budget, independent of rendering and game speed.
export class ActivityClock{
 constructor(now,{backgroundLimit=3600}={}){this.last=now;this.limit=backgroundLimit;this.backgroundUsed=0;this.hidden=false;this.manualPaused=false;}
 advance(now){if(!Number.isFinite(now)||now<this.last)throw Error('Invalid clock');const elapsed=(now-this.last)/1000;this.last=now;if(this.manualPaused)return 0;if(!this.hidden)return elapsed;const allowed=Math.min(elapsed,Math.max(0,this.limit-this.backgroundUsed));this.backgroundUsed+=allowed;return allowed;}
 setHidden(hidden,now){const elapsed=this.advance(now);this.hidden=Boolean(hidden);if(!this.hidden)this.backgroundUsed=0;return elapsed;}
 setPaused(paused,now){const elapsed=this.advance(now);this.manualPaused=Boolean(paused);return elapsed;}
 snapshot(){return{hidden:this.hidden,manualPaused:this.manualPaused,backgroundUsed:this.backgroundUsed,backgroundPaused:this.hidden&&this.backgroundUsed>=this.limit,backgroundLimit:this.limit};}
}
