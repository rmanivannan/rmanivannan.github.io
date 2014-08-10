(function(){
  function FbSearchApp(obj){
  return {
    selector   : obj.selector ? document.querySelector(obj.selector) : null, 
                                                     //form selector elem
    url        : obj.url ? obj.url : null,           //FB service url
    searchData : null,                               //search data

    //common ajax method
    ajax: function(url,method,payLoad,callBack){
      var xmlhttp,self=this;
      xmlhttp= window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status==200){
          var jsonOb = eval('('+xmlhttp.responseText+')');
          callBack.call(self,jsonOb);
        }
        //@future action error handling code has to be added here
      }
      xmlhttp.open(method,url,true);
      xmlhttp.send();
    },

    searchFBPages: function(val){
      this.accessToken = document.querySelector('#accessToken').value;
      var payLoad = [
                      'q='+ val,
                      'type=page',
                      'method=GET',
                      'format=jsonp',
                      'suppress_http_code=1',
                      'access_token=' + this.accessToken
                    ].join('&');
      var url = this.url + payLoad;
      this.ajax(url,'GET',null,this.searchResultSuccess);
    },

    //search success callback method
    searchResultSuccess: function(res){
      this.searchData = res;
      var listCnt = this.selector.querySelector('ol.searchList');
      if(res.data){
        this.constructListView(res.data, listCnt);
      }else if(res.error){
        listCnt.innerHTML = '<li><p class=error>' + res.error.message + '</p></li>'
      }
    },

    //display favourite list
    showFavList: function(e){
      var listCnt = this.selector.querySelector('ol.favList');
      this.constructListView(this.getFavList(),listCnt);
    },

    //construct the list
    constructListView:function(data, listCnt){
      listCnt.innerHTML = this.constructListHtml(this.getCurrentPaginationData(data));
    },

    //returns the pagination data
    getCurrentPaginationData: function(data){
      // future action, returns pagination ar
      return data.sort(this.sortDesByName);
    },

    //retuns DOM list items
    constructListHtml: function(items){
      var tempAr = [];
      for(var i in items){
        var item = items[i];
        var favouriteBtnText = this.isFavouriteId(item.id) ? 'unfavorite' : 'favorite';
        tempAr.push(
                      '<li>',
                        '<strong>', item.name, '</strong>, category: ', item.category,
                        '<br><input type=button class=favBtn data-index=', i ,' data-id=', item.id ,' value=', favouriteBtnText ,'>',
                        '<br><a target="_blank" href="https://www.facebook.com/', item.id ,'">more...<a>',
                      '</li>'
                    );
      }
      return tempAr.join('');
    },

    //retuns whethed id is in fav list or not : boolean
    isFavouriteId: function(id){
      var arr = JSON.parse(localStorage.getItem('favIdList'));
      return arr ? (arr['id_'+id] ? true : false) : false;
    },

    //save the fav data in lacalstorage
    setFavId:function(id,isRemove,index){
      var arr = localStorage.getItem('favIdList') ? JSON.parse(localStorage.getItem('favIdList')) : {};
      if(isRemove){
        delete arr['id_'+id];
      }else{
        arr['id_'+id] = this.searchData.data[index];
      }
      localStorage.setItem('favIdList',JSON.stringify(arr));
    },

    //returns the fav list from ocalstorage
    getFavList: function(){
      var arr = localStorage.getItem('favIdList') ? JSON.parse(localStorage.getItem('favIdList')) : {};
          favList = [];
      for(var i in arr){
        favList.push(arr[i]);
      }
      return favList;
    },

    //object array des sorting method by prop-name
    sortDesByName: function(obj1, obj2) {
      return obj1.name > obj2.name ? -1 : (obj1.name > obj2.name ? 1 : 0);
    },

    //changes the fav option
    changeFav: function(elem){
      var id       = elem.getAttribute('data-id'),
          isRemove = elem.value == 'favorite' ? false : true,
          index    = elem.getAttribute('data-index');
      elem.value = elem.value == 'favorite' ? 'unfavorite' : 'favorite';
      this.setFavId(id,isRemove,index);
      this.showFavList();
    },

    //event binding
    addEvent: function(selector){
      var textElm = this.selector,
      ulElem      = document.createElement('ol');
      self        = this;

      ulElem.setAttribute('class','searchList');

      if(!textElm.querySelector('ol.searchList'))
        textElm.appendChild(ulElem);


      textElm.addEventListener('submit',function(e){
        self.searchFBPages.call(self,e.target.children[1].value)
      },false);

      textElm.addEventListener('click',function(e){
        switch(e.target.getAttribute('class')){
          case 'favBtn':{
            self.changeFav.call(self,e.target);
            break;
          }
          case 'showFavList':{
            self.showFavList.call(self,e.target);
            break;
          }
        }
      },false);
    },

    //Method: sets the initials values and event buindings
    init:function(){
      this.addEvent();
    }
  }
  
  }
  //initiate site functionality
  var searchOb = new FbSearchApp({
    url      :'https://graph.facebook.com/v2.0/search?',
    selector :'#searchFbPages'
  });
  searchOb.init();
})();