define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/storyList.html',
  'views/common/storiesListView'
], function($, _, Backbone, storyListTpl, storyBoardCreatedStories){

  var storiesListView = Backbone.View.extend({
    stories: [],
    isTaskBoard:false,
    events:{
      'change .priorityTxtField': 'onPropertyChange'
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
      this.compailedTpl = _.template(storyListTpl)({'stories' : this.stories,'isTaskBoard':this.isTaskBoard});
      this.$el.html(this.compailedTpl);

    },
    onPropertyChange: function(e){
      e.stopImmediatePropagation();
      var index = $(e.target).parents('li').find('[type="hidden"]').val();
      var property = $(e.target).attr('placeholder');
      this.stories[index][property] = $(e.target).val();
      localStorage.setItem('stories',JSON.stringify(this.stories));
    }
  });

  return storiesListView;
  
});
