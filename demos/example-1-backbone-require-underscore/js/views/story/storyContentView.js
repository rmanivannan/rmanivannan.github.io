define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/mainContent.html',
  'text!templates/carousel.html',
  'views/common/storiesListView'
], function($, _, Backbone, mainContentTemplate, carouselTemplate, storyBoardCreatedStories){

  var storyContentView = Backbone.View.extend({
    
    el: $("#homeView"),
    pageTitle: 'Default Page Heading',
    stories: [],

    events:{
      'click  #addStoryBtn'      : 'onAddStory',
      'submit #addNewStoryForm'  : 'onAddNewStorySubmit',
      'click  #cancelAddNewForm' : 'displayAddNewStoryForm'
    },
    initialize: function(){
      if (localStorage.getItem('stories')) {
        // !!future action: this value has to be taken from model
        this.stories = JSON.parse(localStorage.getItem('stories'));
      };
    },
    render: function(ob){
      if(ob){
        $.extend(this,ob);
      }
      this.compailedTpl = _.template(mainContentTemplate)({'pageTitle' : this.pageTitle});
      this.$el.html(this.compailedTpl);

      this.storiesView = new storyBoardCreatedStories({el: $("#storyContainer")});
      this.storiesView.render({'stories':this.stories,'isTaskBoard':false});
    },
    //on click of add story button, to show the form filelds
    onAddStory: function(e){
      this.displayAddNewStoryForm('show');
    },

    //on submit of new story form field
    onAddNewStorySubmit: function(e){
      this.displayAddNewStoryForm('hide');
      this.stories.unshift({
                          'status'         :'todo',
                          'title'          :this.$('[placeholder="story name"]').val(),
                          'description'    :this.$('[placeholder="Type story description here"]').val(),
                          'priority'       :this.$('#addNewStoryForm select').val(),
                          'estimatedHours' :this.$('[placeholder="estimated hours"]').val(),
                        });

      // !!future action: this action has to be moved to model
      localStorage.setItem('stories',JSON.stringify(this.stories));
      
      this.storiesView.render({'stories':this.stories});
    },

    // displa add story form section toogle toggle method 
    displayAddNewStoryForm: function(state){
      if(state == 'show'){
        this.$('#addStoryCnt').show();
        this.$('#addStoryBtn').hide();        
      }else{
        this.$('#addStoryCnt').hide();
        this.$('#addStoryBtn').show();
      }
    }
  });

  return storyContentView;
  
});
