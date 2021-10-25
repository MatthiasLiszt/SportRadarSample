import fetch from 'node-fetch';
//import * as getJSON from 'get-json';
const getJSON = require('get-json');


export class middleware {

    
  constructor(){        
  }

  execute(req: any, res: any, next: any){
    const timestamp = (parseInt(req.query.ts)>=0)?parseInt(req.query.ts):Date.now();
    const date = new Date(timestamp);    
    //const tournaments = 'https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/config_tournaments/'+(date.getMonth()+1)+'/'+date.getDate();
    const tournaments = 'https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/config_tournaments/1/17';
    const matches = 'https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/fixtures_tournament/';//{_tid}/2021';      
    const limit = 5;
    const team = (req.query.team === undefined)?' ':req.query.team;
    const event = (req.query.event === undefined)?' ':req.query.event;
    
    getJSON(tournaments)
      .then(function(response: any) {
        const tids = getTid(response.doc[0].data.tournaments);
        getMatches(matches, tids, date.getFullYear())
          .then((r:Array<any>)=>{            
            r.length = limit;
            req.middleware = r;
            next();            
          });        
       }).catch(function(error: any) {
        console.log(error);
        next();
       });    
    function getTid(data: any): Array<any>{
      var result:Array<any> = [];
      data.forEach((t: any)=>{result.push({_tid: t._tid, name: t.name});});
      return result;
    }
    async function getMatches(url: string, tids: Array<any>, year: number): Promise<Array<any>>{      
      var tournaments: Array<any> = [];
      for(let tid of tids){
        const result = await getJSON(url+tids[0]._tid+'/'+year);
        tournaments.push({tid: tid, lastMatches: furtherFilters(filterMatches(result.doc[0].data))});
      }  
      return new Promise(resolve => {resolve(tournaments);});
    }   
    function filterMatches(matches: any): Array<any>{
      var result:Array<any> = [];      
      var ids = Object.keys(matches.matches);          
      for(let id of ids){
        var m = matches.matches.id;
        result.push({id: matches.matches[id]["_id"], 
                     ts: matches.matches[id]["time"]["uts"],
                     home: matches.matches[id].teams.home.name,
                     away: matches.matches[id].teams.away.name,
                     score: {home: matches.matches[id].result.home, away: matches.matches[id].result.away} ,
                     event: matches.matches[id].comment
        });
      }           
      const sorted = sortMatches(result);
      return sorted;
    }
    function sortMatches(matches: Array<any>){
      const sorted = matches.sort((a, b) => {
        return b.ts-a.ts;
      });
      return sorted;
    }
    
    function filterScore(data: any, home: string, away: string): any {
      let filtered: Array<any> = [];
      console.log('score filter');
      console.log(JSON.stringify(data).substring(0,240));
      console.log('data '+Array.isArray(data));
      if(req.query.home!=='-'&&req.query.away!=='-'){
        console.log('applied');
        const score1 = parseInt(home);
        const score2 = parseInt(away);
        for(let match of data){
          if(match.score.home===score1&&match.score.away===score2)
           {filtered.push(match);}
        } 
        return filtered;
      }
      console.log('not applied');
      return data;
    }
    function filterTeam(data: any,team: string): any {
      let filtered: Array<any> = [];
      console.log('team filter');
      if(team.length > 2 ){
        console.log('applied');
        for(let match of data){
          if(match.home === team || match.away === team)
           {filtered.push(match);}
        } 
        return filtered;
      }
      console.log('not applied');
      return data;
    }
    function filterEvent(data: any, event: string): any {
      let filtered: Array<any> = [];
      if(event.length > 2  ){
        for(let match of data){
          if(event === match.event)
           {filtered.push(match);}
        } 
        return filtered;
      }
      return data;
    }
    function furtherFilters(data: Array<any>): Array<any>{
      let filtered: Array<any> = [];
      filtered = filterScore(data, req.query.home, req.query.away);
      filtered = filterTeam(filtered, team);
      filtered = filterEvent(filtered, event);
      return filtered;
    }
  }
  
}
