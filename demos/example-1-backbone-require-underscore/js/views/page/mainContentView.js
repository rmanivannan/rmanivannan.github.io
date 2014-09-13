define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/storyBoard.html',
  'views/common/headerView',
  'views/story/storyContentView',
  'views/task/taskContentView'
], function($, _, Backbone, homeTemplate, HeaderView, StoryContentView, TaskContentView){

  var storyPageView = Backbone.View.extend({
    el: $("#homeView"),

    render: function(ob){
      if(ob)$.extend(this,ob);
      this.$el.html(homeTemplate);
      this.createSubViews();
    },
    menuList:[
                {name :'Task Board',  cls:'', href: '#taskBoard'},
                {name :'Story Board', cls:'', href: '#storyBoard'}
              ],
    initialize:function(){
    },

    // Create header and content view
    createSubViews: function(){
      var self = this;
      var mainContentView;
      switch(this.pageTitle){
        case 'Task Board':{
          self.menuList[0].cls = 'active';
          self.menuList[1].cls = '';
          mainContentView = new TaskContentView({ el: $("#mainContent")});
          break;
        }
        case 'Story Board':{
          self.menuList[1].cls = 'active';
          self.menuList[0].cls = '';
          mainContentView = new StoryContentView({ el: $("#mainContent")});
          break;
        }
      }
      var headerView = new HeaderView({ el: $("#header")});
      headerView.render({ 'menuList': this.menuList });

      mainContentView.render();

      $('head title').text('IMS health coding test - ' + this.pageTitle)

    }

  });

  return storyPageView;
  
});
