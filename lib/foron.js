(function(document, window, undefined) {
    function ValueScope(dtns, v) {
        var self = this;
        this.value = v;
        this.domTreeNodeScope = dtns;
        var __getValue = function(v) {
            return (v instanceof ValueScope) ? v.value : v;
        }
        this.num = function() {
            var n = Number(self.value);
            self.value = Number.isNaN(n) ? 0 : n;
            return self;
        };
        this.eq = function(v) {
            self.value = self.value == __getValue(v);
            return self;
        };
        this.between = function(min, max) {
            self.value = (self.value > __getValue(min) && self.value < __getValue(max));
            return self;
        };
        this.gt = function(v) {
            self.value = self.value > __getValue(v);
            return self;
        };
        this.lt = function(v) {
            self.value = self.value < __getValue(v);
            return self;
        };
        this.gte = function(v) {
            self.value = self.value >= __getValue(v);
            return self;
        };
        this.lte = function(v) {
            self.value = self.value <= __getValue(v);
            return self;
        };
        this.ne = function(v) {
            self.value = self.value != __getValue(v);
            return self;
        };
        this.and = function(v) {
            self.value = self.value && __getValue(v);
            return self;
        };
        this.or = function(v) {
            self.value = self.value || __getValue(v);
            return self;
        };
        this.then = function() {
            return self.domTreeNodeScope.__always(self.value);
        };
        this.prop = function(p) {
            self.value = self.value[p];
            return self;
        }
        this.op = function() { //op('substr',2,3)
            if (arguments.length > 0) {
                var args = [];
                for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
                self.value = self.value[arguments[0]].apply(self.value, args);
            } else
                console.error("op() needs at least 1 argument");
            return self;
        };
    }

    function DomTreeNodeScope(el) {
        var self = this;
        var __currentNode = [el];
        this.currentNode = [el];
        var currentWait = null;
        var currentCondition = true;
        var queueTask = []; //TODO
        var __getValue = function(v) {
            return (v instanceof ValueScope) ? v.value : v;
        }
        var __trimIt = function(str) {
            return (typeof str == 'string') ? str.trim() : str;
        }
        this.__always = function(condition) {
            currentCondition = condition;
            return self;
        }
        this.me = function(bool) {
            if (bool)
                return new DomTreeNodeScope(__currentNode[0]);
            else {
                if (self.currentNode[0] != __currentNode[0])
                    self.currentNode = __currentNode.slice();
                return self;
            }
        };
        this.reset = function() {
            queueTask = [];
            if (self.currentNode[0] != __currentNode[0] || self.currentNode.length != 1)
                self.currentNode = __currentNode.slice();
            return self;
        }
        var createWaitedFunction = function(cb) {
            if (currentWait) {
                setTimeout(function() {
                    cb();
                }, currentWait);
                currentWait = null;
            } else
                cb();
        };
        this.enqueue = function() {
            queueTask.push(self.currentNode);
        };
        this.id = function(id) {
            self.currentNode[self.currentNode.length - 1] = document.getElementById(id);
            fallback_and();
            return self;
        };
        this.trigger = function(type) {
            if (!currentCondition) return self;
            //var event = document.createEvent('Event');
            //event.initEvent(type, true, true);
            //self.currentNode.dispatchEvent(event);
            createWaitedFunction(function() {
                for (var i = 0; i < self.currentNode.length; i++)
                    self.currentNode[i].dispatchEvent(new Event(type, { "bubbles": true, "cancelable": true }));
            });
            return self;
        };
        this.wait = function(mil) {
            if (!currentCondition) return self;
            if (mil > 0) currentWait = mil;
            return self;
        };
        this.msg = function(x) {
            if (!currentCondition) return self;
            createWaitedFunction(function() {
                if (window.alert)
                    window.alert(x);
            });
            return self;
        };
        this.addClass = function(className) {
            if (!currentCondition) return self;
            var c = __trimIt(__getValue(className));
            createWaitedFunction(function() {
                for (var i = 0; i < self.currentNode.length; i++)
                    if (self.currentNode[i].className.indexOf(c) < 0)
                        self.currentNode[i].className += " " + c;
            });
            return self;
        };
        this.setClass = function(className) {
            if (!currentCondition) return self;
            var c = __trimIt(__getValue(className));
            createWaitedFunction(function() {
                console.log(self.currentNode);
                for (var i = 0; i < self.currentNode.length; i++)
                    if (self.currentNode[i].className != c)
                        self.currentNode[i].className = c;
            });
            return self;
        };
        this.toggleClass = function(className) {
            if (!currentCondition) return self;
            var c = __trimIt(__getValue(className));
            createWaitedFunction(function() {
                for (var i = 0; i < self.currentNode.length; i++)
                    if (self.currentNode[i].className.indexOf(c) < 0)
                        self.currentNode[i].className += " " + c;
                    else
                        self.currentNode[i].className = self.currentNode[i].className.replace(new RegExp(c, ''), '');
            });
            return self;
        };
        this.removeClass = function(className) {
            if (!currentCondition) return self;
            var c = __trimIt(__getValue(className));
            createWaitedFunction(function() {
                for (var i = 0; i < self.currentNode.length; i++)
                    self.currentNode[i].className = self.currentNode[i].className.replace(new RegExp(c, ''), '');
            });
            return self;
        };
        this.next = function() {
            var i = self.currentNode.length - 1;
            if (self.currentNode[i].nextElementSibling != null)
                self.currentNode[i] = self.currentNode[i].nextElementSibling;
            else
                fallback_and();
            return self;
        };
        this.prev = function() {
            var i = self.currentNode.length - 1;
            if (self.currentNode[i].previousElementSibling != null)
                self.currentNode[i] = self.currentNode[i].previousElementSibling;
            else
                fallback_and();
            return self;
        };
        this.parent = function() {
            var i = self.currentNode.length - 1;
            self.currentNode[i] = self.currentNode[i].parentElement;
            return self;
        };
        this.set = function(content) {
            if (!currentCondition) return self;
            var c = __getValue(content);
            createWaitedFunction(function() {
                for (var i = 0; i < self.currentNode.length; i++)
                    self.currentNode[i].innerText = c;
            });
            return self;
        };
        this.append = function(content) {
            if (!currentCondition) return self;
            var c = __getValue(content);
            createWaitedFunction(function() {
                for (var i = 0; i < self.currentNode.length; i++)
                    self.currentNode[i].innerText += c;
            });
            return self;
        };
        this.enable = function(bool) {
            if (!currentCondition) return self;
            for (var i = 0; i < self.currentNode.length; i++)
                self.currentNode[i].disabled = bool != true;
            return self;
        }
        this.toggleHide = function(css) {
            if (!currentCondition) return self;
            for (var i = 0; i < self.currentNode.length; i++)
                if (css)
                    self.currentNode[i].style.display = self.currentNode[i].style.display == "none" ? "" : "none";
                else
                    self.currentNode[i].hidden = !self.currentNode[i].hidden;
            return self;
        };
        this.log = function(content, logger) {
            if (!currentCondition) return self;
            var fn = !logger ? console.log : logger;
            //fn(content instanceof ValueScope ? content.value : self.currentNode[!content?'value':content]);
            if (content instanceof ValueScope)
                fn(content.value);
            else
                for (var i = 0; i < self.currentNode.length; i++)
                    fn(self.currentNode[i][!content ? 'value' : content]);
            return self;
        };
        this.bind = function(selector, content) {
            if (!currentCondition) return self;
            createWaitedFunction(function() {
                var type = !content ? 'innerText' : content;
                if (selector != undefined) {
                    var nodes = document.querySelectorAll(selector);
                    for (var i = 0; i < nodes.length; i++)
                        if (nodes[i] !== __currentNode)
                            nodes[i][type] = __currentNode[0].value;
                } else if (self.currentNode[0] !== __currentNode[0]) {
                    for (var i = 0; i < self.currentNode.length; i++)
                        self.currentNode[i][type] = __currentNode[0].value;
                }
            });
            return self;
        };
        this.attr = function(attrName) {
            return new ValueScope(self, self.currentNode[0].getAttribute(attrName));
        };
        this.val = function() {
            return new ValueScope(self, self.currentNode[0].value);
        };
        this.otherwise = function() {
            return this.__always(!currentCondition);
        };
        this.but = function() {
            return this.__always(true);
        };
        this.and = function() { //duplicate the last
            var len = self.currentNode.length;
            if (len > 1) {
                if (self.currentNode[len - 1] != self.currentNode[len - 2])
                    self.currentNode = self.currentNode.concat(self.currentNode.slice(self.currentNode.length - 1));
            } else
                self.currentNode = self.currentNode.concat(self.currentNode.slice(self.currentNode.length - 1));
            return self;
        };
        var fallback_and = function() { //undo the and operation if needed
            var len = self.currentNode.length;
            if (len > 1)
                if (self.currentNode[len - 1] == self.currentNode[len - 2])
                    self.currentNode.splice(len - 1);
        };
        this.select = function(selector) {
            var last = self.currentNode.length - 1;
            var nodes = document.querySelectorAll(selector);
            for (var i = 0; i < nodes.length; i++)
                if (!self.currentNode.includes(nodes[i]))
                    self.currentNode[last++] = nodes[i];
            fallback_and();
            return self;
        };
    }

    function DomTreeNode(el) {
        this.node = el;
        this.events = {};
        this.children = [];
        this.scope = new DomTreeNodeScope(this.node);
    }
    var domTree = {};
    var initQueue = [];
    var MO = window.MutationObserver || window.WebKitMutationObserver;

    function createObserver(el, cb) {
        if (MO) {
            var obs = new MO(function(mutations, observer) {
                /*if(mutations[0].type==='attributes'){
                    callback({type:mutations[0].attributeName,oldVal:mutations[0].oldValue,newVal:mutations[0].target.className});
                }else if( mutations[0].addedNodes.length)
                    callback({type:'children_add',oldVal:null,newVal:mutations[0].addedNodes});
                else if(mutations[0].removedNodes.length)
                    callback({type:'children_remove',oldVal:null,newVal:mutations[0].removedNodes});
                else
                    console.log(mutations[0].type,mutations[0]);*/
                cb(mutations[0].type);
            });
            obs.observe(el, { attributes: true, attributeOldValue: true, childList: true, subtree: true });
        }
    }
    var supportedAttributes = [{
        events: ["init"],
        name: "f-init",
        cbScan: function(node) {
            initQueue.push(node);
        }
    }, {
        events: ["contextmenu"],
        name: "f-rclick"
    }, {
        events: ["input", "paste", "propertychanged"],
        name: "f-bind"
    }, {
        events: ['fwatch'],
        name: "f-watch",
        cbScan: function(node) {
            createObserver(node, function() {
                node.dispatchEvent(new Event("fwatch", { "bubbles": false, "cancelable": true }));
            })
        }
    }];
    var supportedAttributesCommonBootstrap=[
        "click","mouseenter","mouseout"
    ];
    var unSupportedTags = ['SCRIPT'];

    function createNewEvent(__ev, __target, __code) {
        __target.node.addEventListener(__ev, function(__e) {
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
            (new Function("with(this) { " + __code + "}")).call(__target.scope);
        }, false);
    }

    function parseEvent(ev, evc, el, p) {
        p.events[ev] = { code: evc };
        createNewEvent(ev, p, evc);
    }

    function scan(el) {
        if (unSupportedTags.indexOf(el.tagName) >= 0)
            return null;
        var p = new DomTreeNode(el);
        supportedAttributes.forEach(function(e) {
            var applicable = false;
            e.events.forEach(function(event) {
                var ev_content = el.getAttribute(e.name);
                if (ev_content != null) {
                    parseEvent(event, ev_content, el, p);
                    applicable = true;
                }
            });
            if (applicable && e.cbScan) //if scan callback available then call it
                e.cbScan(el);
        });
        var children = [];
        for (var i = 0; i < el.children.length; i++) {
            var c = scan(el.children[i]);
            if (c != null) children.push(c);
        }
        p.children = children;
        return p;
    }

    function init(el) {
        domTree = scan(el || document.body);
        initQueue.forEach(function(el) {
            el.dispatchEvent(new Event("init", { "bubbles": false, "cancelable": true }))
        });
        //console.log(domTree);
    }
    function bootstrap(){
        supportedAttributesCommonBootstrap.forEach(function(e){
            supportedAttributes.push({events:[e],name:"f-"+e});
        })
    }
    bootstrap();
    window.Foron = {
        init: init
    };
})(document, window);