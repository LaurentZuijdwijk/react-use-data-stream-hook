# Data streamer framework

Easy to create service layer and data streaming for React applications.

Here is an example service layer to retrieve and add todos.

```javascript

import { BaseService } from "streamer";

class TodoService extends BaseService {
  constructor(){
      this.todos = []
  }
  getTodos() {
    const subscription = this.subscribe(subject);
    this.write({loading:true})
    fetch('https://catfact.ninja/fact').then((response)=>{
      return response.json();

    }).then(fact => {
      this.write(subject, {...fact, loading: false });
  })
    return subscription;
  }
  addTodo(todo){
    this.todos.push(todo);
    this.write('allTodos', this.todos);
  }
}
```

Note that in the example above we return a `Subscription`, this allows us to use the provided hook like so

```javascript
import { useStreamer } from "streamer";

export default (props) => {
    const { payload } = useStreamer(factService.subscribeToFacts, 'cats');
    if(payload && payload.loading){
        return <span>Loading...</span>
    }

    if(payload && payload.fact){
        return <div>
            <span>{payload.fact}</span><br />
        </div>;
    }
    else return <></>
}
```


