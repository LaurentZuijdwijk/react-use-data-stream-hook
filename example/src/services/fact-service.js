
import { BaseService } from "streamer";

class FactService extends BaseService {
  constructor(){
    super();
    this.subscribeToFacts = this.subscribeToFacts.bind(this);
    this.getFact = this.getFact.bind(this);
  }
  getFact(subject){
    this.write({loading:true})
    fetch('https://catfact.ninja/fact').then((response)=>{
      return response.json();

    }).then(fact => {
      this.write(subject, {...fact, loading: false });
    })
 
  }
  subscribeToFacts(subject) {
    const subscription = this.subscribe(subject);
    this.write({loading:true})
    fetch('https://catfact.ninja/fact').then((response)=>{
      return response.json();

    }).then(fact => {
      this.write(subject, {...fact, loading: false });
  })
    return subscription;
  }
}

export default FactService;
