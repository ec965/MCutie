class Queue {
  constructor() {
    this.q = [];
  }
  send(item){
    this.q.push(item);
  }
  receive(){
    if (this.q.length > 0){
      return this.q.shift();
    }
    return false;
  }
  peek(){
    if (this.q.length > 0){
      return this.q[0];
    }
    return false;
  }
  reset() {
    this.q.length = 0;
  }
  isEmpty() {
    if (this.q.length){
      return false;
    }
    return true;
  }
}

module.exports=Queue;