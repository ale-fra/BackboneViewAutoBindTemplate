
var getTemplate= function(urls){
    this.tmpl = {};
    var names=[];
    var _this = this;
    _.each(urls,function(url){
        var name = url.substring(url.lastIndexOf('/')+1,url.lastIndexOf('.'));
        names.push(name);
        if('getURL' in chrome.runtime) {
            url = chrome.runtime.getURL(url);
        }
        $.ajax({ url: url}).success(function(template){
            _this.tmpl[name] =function(model){
                return Mustache.render(template,model);
            }
            allLoaded();
        })
    });

    function allLoaded(){
        var loaded = true;
        _.forEach(names,function(name){
            if(_this.tmpl[name]===undefined){
                loaded = false;
                return false;
            }

        });
        if(loaded){
            _this.tmpl.loaded = loaded;
        }
    }
}


var ParentView = Backbone.View.extend({
    initialize: function(options){
        if(this.template &&  this.template.length) {
            var getTemplate = _.bind(app.getTemplate, this);
            getTemplate(this.template);
        }
        this.init();
    },
    render: function(){
        if(this.template && this.template.length && !this.tmpl.loaded) {
            var render = _.bind(this.render,this);
            setTimeout(render, 0);
            return false;
        }
        this.$el.empty();

        this.apply();
    },
    init: function(){},
    apply:function(){}
});



var ChildView =  ParentView.extend({

    // template have to be an array of urls
    template : ['html/recapitulationView/Table.html','html/recapitulationView/Row.html'],

    // use init instead of initialize
    init: function () {
        // is called automatically as initialize
    },
    // use init apply instad of render
    apply: function () {
        // is runned automatically when render function have binded the template
        // now you can use this.tmpl.Table && this.tmpl.Row  (this.tmpl + file html name )


        // do something here

        return this;
    }
});



