var TagItem = (function(w){
    // stateless functions
    var log = function(x, doing, what){
      console.log('doing', doing, ' ', what,' has the value', x);
    };
    var run = function(){
      var me = this;
      add.call(me);
      sub.call(me);
    };
    var add = function(){
      this.x = this.x+1;
      log(this.x, 'add', 'x');
    };
  
    var sub = function(){
      this.x = this.x-1;
      log(this.x, 'sub', 'x');
    };
  
  
  var obj = function(){
    this.x = 1  
  };
  
  $.extend(obj.prototype, { run : run}); 
  
  return obj;
  
})(window);
