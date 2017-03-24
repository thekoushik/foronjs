(function(document,window,undefined){
    function ValueScope(dtns,v){
        var self=this;
        this.value=v;
        this.domTreeNodeScope=dtns;
        var __getValue=function(v){
            return (v instanceof ValueScope)?v.value:v;
        }
        this.num=function(){
            var n=Number(self.value);
            self.value=Number.isNaN(n)?0:n;
            return self;
        };
        this.eq=function(v){
            self.value=self.value==__getValue(v);
            return self;
        };
        this.between=function(min,max){
            self.value=(self.value>__getValue(min) && self.value<__getValue(max));
            return self;
        };
        this.gt=function(v){
            self.value=self.value>__getValue(v);
            return self;
        };
        this.lt=function(v){
            self.value=self.value<__getValue(v);
            return self;
        };
        this.gte=function(v){
            self.value=self.value>=__getValue(v);
            return self;
        };
        this.lte=function(v){
            self.value=self.value<=__getValue(v);
            return self;
        };
        this.ne=function(v){
            self.value=self.value!=__getValue(v);
            return self;
        };
        this.and=function(v){
            self.value=self.value && __getValue(v);
            return self;
        };
        this.or=function(v){
            self.value=self.value || __getValue(v);
            return self;
        };
        this.then=function(){
            return self.domTreeNodeScope.__always(self.value);
        };
        this.prop=function(p){
            self.value=self.value[p];
            return self;
        }
        this.op=function(){//op('substr',2,3)
            if(arguments.length>0){
                var args=[];
                for(var i=1;i<arguments.length;i++) args.push(arguments[i]);
                self.value=self.value[arguments[0]].apply(self.value,args);
            }else
                console.error("op() needs at least 1 argument");
            return self;
        };
    }
    function DomTreeNodeScope(el){
        var self=this;
        var __currentNode=el;
        this.currentNode=el;
        var currentWait=null;
        var currentCondition=true;
        var queueTask=[];//TODO
        this.__always=function(condition){
            currentCondition=condition;
            return self;
        }
        this.me=function(){
            if(self.currentNode!=__currentNode)
                self.currentNode=__currentNode;
            return self;
        };
        this.reset=function(){
            queueTask=[];
            if(self.currentNode!=__currentNode)
                self.currentNode=__currentNode;
            return self;
        }
        var createWaitedFunction=function(cb){
            if(currentWait){
                setTimeout(function(){
                    cb();
                },currentWait);
                currentWait=null;
            }else
                cb();
        };
        this.enqueue=function(){
            queueTask.push(self.currentNode);
        };
        this.id=function(id){
            self.currentNode=document.getElementById(id);
            return self;
        };
        this.trigger=function(type){
            if(!currentCondition) return self;
            //var event = document.createEvent('Event');
            //event.initEvent(type, true, true);
            //self.currentNode.dispatchEvent(event);
            createWaitedFunction(function(){
                self.currentNode.dispatchEvent(new Event(type,{"bubbles":true, "cancelable":true}));
            });
            return self;
        };
        this.wait=function(mil){
            if(!currentCondition) return self;
            if(mil>0) currentWait=mil;
            return self;
        };
        this.msg=function(x){
            if(!currentCondition) return self;
            createWaitedFunction(function(){
                if(window.alert)
                    window.alert(x);
            });
            return self;
        };
        this.addClass=function(c){
            if(!currentCondition) return self;
            createWaitedFunction(function(){
                if(self.currentNode.className.indexOf(c)<0)
                    self.currentNode.className+=" "+c;
            });
            return self;
        };
        this.toggleClass=function(c){
            if(!currentCondition) return self;
            createWaitedFunction(function(){
                if(self.currentNode.className.indexOf(c)<0)
                    self.currentNode.className+=" "+c;
                else
                    self.currentNode.className=self.currentNode.className.replace(new RegExp(c,''),'');
            });
            return self;
        };
        this.removeClass=function(c){
            if(!currentCondition) return self;
            createWaitedFunction(function(){
                self.currentNode.className=self.currentNode.className.replace(new RegExp(c,''),'');
            });
            return self;
        };
        this.next=function(){
            if(self.currentNode.nextElementSibling!=null)
                self.currentNode=self.currentNode.nextElementSibling;
            return self;
        };
        this.prev=function(){
            if(self.currentNode.previousElementSibling!=null)
                self.currentNode=self.currentNode.previousElementSibling;
            return self;
        };
        this.parent=function(){
            self.currentNode=self.currentNode.parentElement;
            return self;
        };
        this.set=function(c){
            if(!currentCondition) return self;
            createWaitedFunction(function(){
                self.currentNode.innerText=c;
            });
            return self;
        };
        this.append=function(c){
            if(!currentCondition) return self;
            createWaitedFunction(function(){
                self.currentNode.innerText+=c;
            });
            return self;
        };
        this.enable=function(bool){
            if(!currentCondition) return self;
            self.currentNode.disabled=bool!=true;
            return self;
        }
        this.toggleHide=function(css){
            if(!currentCondition) return self;
            if(css)
                self.currentNode.style.display=self.currentNode.style.display=="none"?"":"none";
            else
                self.currentNode.hidden=!self.currentNode.hidden;
            return self;
        };
        this.log=function(content,logger){
            if(!currentCondition) return self;
            var fn=!logger?console.log:logger;
            var type=!content?'value':content;
            fn(self.currentNode[type]);
            return self;
        };
        this.bind=function(selector,content){
            if(!currentCondition) return self;
            createWaitedFunction(function(){
                var type=!content?'innerText':content;
                if(selector!=undefined){
                    var nodes=document.querySelectorAll(selector);
                    nodes.forEach(function(node){
                        if(node!==__currentNode)
                            node[type]=__currentNode.value;
                    });
                }else if(self.currentNode!==__currentNode){
                    self.currentNode[type]=__currentNode.value;
                }
            });
            return self;
        };
        this.attr=function(attrName){
            return new ValueScope(self,self.currentNode.getAttribute(attrName));
        };
        this.val=function(){
            return new ValueScope(self,self.currentNode.value);
        };
        this.otherwise=function(){
            return this.__always(!currentCondition);
        };
        this.but=function(){
            return this.__always(true);
        }
    }
    function DomTreeNode(el){
        this.node=el;
        this.events={};
        this.children=[];
        this.scope=new DomTreeNodeScope(this.node);
    }
    var domTree={};
    var initQueue=[];
    var supportedAttributes=[
        {
            events:["init"],
            name:"f-init",
            cbScan:function(node){
                initQueue.push(node);
            }
        },{
            events:["click"],
            name:"f-click"
        },
        {
            events:["contextmenu"],
            name:"f-rclick"
        },
        {
            events:["input","paste","propertychanged"],
            name:"f-bind"
        }
    ];
    var unSupportedTags=['SCRIPT'];
    function createNewEvent(__ev,__target,__code){
        __target.node.addEventListener(__ev,function(__e){
            /*
            function maskedEval(scr){
                // set up an object to serve as the context for the code being evaluated. 
                var mask = {};
                // mask global properties 
                for (p in this) mask[p] = undefined;
                // execute script in private context
                (new Function( "with(this) { " + scr + "}")).call(mask);
            }
            */
            __target.scope.reset();
            (new Function( "with(this) { " + __code + "}")).call(__target.scope);
        }, false);
    }
    function parseEvent(ev,evc,el,p){
        if(evc==null)
            return false;
        p.events[ev]={code:evc};
        createNewEvent(ev,p,evc);
        return true;
    }
    function scan(el){
        if(unSupportedTags.indexOf(el.tagName)>=0)
            return null;
        var p=new DomTreeNode(el);
        supportedAttributes.forEach(function(e){
            e.events.forEach(function(event){
                if(parseEvent(event,el.getAttribute(e.name),el,p))
                    if(e.cbScan)//if scan callback available then call it
                        e.cbScan(el);
            })
        });
        var children=[];
        for(var i=0;i<el.children.length;i++){
            var c=scan(el.children[i]);
            if(c!=null) children.push(c);
        }
        p.children=children;
        return p;
    }
    function init(el){
        domTree=scan(el || document.body);
        initQueue.forEach(function(el){
            el.dispatchEvent(new Event("init",{"bubbles":false, "cancelable":true}))
        });
        //console.log(domTree);
    }
    //init();
    window.Foron={
        init:init
    };
})(document,window);