define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/header.html',
], function($, _, Backbone, headerTemplate ){

  var HeaderView = Backbone.View.extend({

    //this object can be get from some Rest service and data will be sync through collection and model
    menuList: [],
    events:{
      'click .menuToggle' : 'toggleMene'
    },
    render: function(ob){
      if(ob){
        $.extend(this,ob);
      }
      this.compailedTpl = _.template(headerTemplate)({'menuList' : this.menuList});
      this.$el.html(this.compailedTpl);
    },
    toggleMene:function(){
      $('#header nav').slideToggle();
    }
  });

  return HeaderView;
  
});
