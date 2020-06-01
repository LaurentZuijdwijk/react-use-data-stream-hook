# Data streamer framework

Easy to create service layer for React applications. 


Here is an example service layer to retrieve and add todos. 

```javascript

import { BaseService } from "streamer";

class TodoService extends BaseService {
  constructor(){
      this.todos = []
  }
  getTodos() {
    const subscription = this.subscribe('allTodos')
    setTimeout(()=>{
        subscription.write(this.todos)
    }, 100)
 
    return subscription;
  }
  addTodo(todo){
    this.todos.push(todo);
    if(this.hasSubscription('allTodos')) {
      this.write('allTodos', this.todos)
    }
  }
}

```

