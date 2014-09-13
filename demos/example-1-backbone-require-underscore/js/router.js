// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/page/mainContentView'
], function($, _, Backbone,MainContentView) {
  
   var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'taskBoard'  : 'showTaskBoard',
      'storyBoard' : 'showStoryBoard',
      // Default
      '*actions'   : 'showStoryBoard'
    }
  });

  var initialize = function(){

    var app_router      = new AppRouter;
       
    
    app_router.on('route:showTaskBoard', function(){
      console.log('navigate to TaskBoard')
      var TaskBoard = new MainContentView();
      TaskBoard.render({pageTitle:'Task Board'});
    });

    app_router.on('route:showStoryBoard', function (actions) {
      console.log('navigate to StoryBoard')
      var StoryBoard = new MainContentView();
      StoryBoard.render({pageTitle:'Story Board'});
    });

    Backbone.history.start();
  };

  return { 
    initialize: initialize
  };
});
