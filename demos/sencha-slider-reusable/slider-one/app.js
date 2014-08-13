Ext.application({
    name: 'Customslider',
    glossOnIcon: false,

    views: ['Main'],

    launch: function() {
        Ext.Viewport.add({
            xclass: 'Customslider.view.Main'
        });
    }
});
