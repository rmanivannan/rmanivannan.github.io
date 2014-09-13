define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/taskBoardContent.html',
  'text!templates/carousel.html',
  'views/common/storiesListView'
], function($, _, Backbone, mainContentTemplate, carouselTemplate, storyBoardCreatedStories){

  var taskbordContentView = Backbone.View.extend({
    
    el: $("#homeView"),
    pageTitle: 'Default Page Heading',
    stories: [],

    events:{
      'keyup  #storySearchBox' : 'onStorySearchBoxKeyup'
    },
    initialize: function(){
      if (localStorage.getItem('stories')) {
        this.stories = JSON.parse(localStorage.getItem('stories'));
      };
    },
    render: function(ob){
      if(ob){
        $.extend(this,ob);
      }

      //compale the task board comtent
      this.compailedTpl = _.template(mainContentTemplate)();
      this.$el.html(this.compailedTpl);

      // showing the all storiers which is created in the story board
      this.storiesView = new storyBoardCreatedStories({el: $("#taskBoardStoriestList")});
      this.storiesView.render({'stories':this.stories,'isTaskBoard':true});

      this.addDragableGlobalEvents();

      //Future action: add task and the list has to be created as like add story and list
    },
    
    //adding drag functionality to move the stories to todo,inprogress,done sections
    addDragableGlobalEvents:function(){
      window.imsGlobalMethods = {
        allowDrop:function (ev) {
          ev.preventDefault();
        },
        drag:function(ev) {
          ev.dataTransfer.setData("storyListId", ev.target.id);
        },
        drop:function (ev) {
          ev.preventDefault();
          var data = ev.dataTransfer.getData("storyListId");
          ev.target.appendChild(document.getElementById(data));
        }
      };
    },

    // stories search function: which reset the story list based on the key entered
    onStorySearchBoxKeyup:function(e){
      var self = this;
      this.searchText = $(e.target).val();
      var searchResOb = this.stories.filter(function(a){
        return a.title.search(self.searchText) == -1 ? false : true;
      });
      this.storiesView.render({'stories':searchResOb,'isTaskBoard':true});
    }
  });

  return taskbordContentView;
  
});
