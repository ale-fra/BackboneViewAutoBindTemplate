BackboneViewAutoBindTemplate
============================

I used this view to auto bind my template, i'd to use MustaceJs because i used it in a chrome extension 

using this view you have just to declare you template as array of url :


this function to load async the template :

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


this is my ChildView:

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


and this is the parent View :

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



and now calling "var myView = new ChildView();" it will be  called before the ParentView initialize that will load and bind the template.
after, executing "myView.render();" it will call the ParentView Render() that will wait until the template will be binded and than execute the ChildView Apply()!

I've tested it with 5~6 template and it spend about 250 millis to bind the template.
