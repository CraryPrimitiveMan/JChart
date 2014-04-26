window.JChart = function() {
    var chart = this;

    chart.pieTypes = ['angle', 'radius'];
    chart.fields = {
        defaultText : "text",
        defaultValue : "value"
    };

    chart.Pie = function(elem, data, options) {
        chart.Pie.defaults = {
            margin : { top: 20, right: 40, bottom: 20, left: 40 },
            width : 300,
            height : 250,
            radius : 125,
            radiusMin : 50,
            opacity : 0.8,
            animation : { enabled : true, time : 1000, delayTime : 0 },
            type: 'angle', //'radius'
            field : { valueField : chart.fields.defaultValue, textField : chart.fields.defaultText},
            hooks: {
                // preInitHooks : function(){},                   // 在初始化之前执行  called before initialization.
                // postInitHooks : function(){},                  // 在初始化之后执行called after initialization.
                // preParseOptionsHooks : function(){},           // 在解析options参数之前执行  called before user options are parsed.
                // postParseOptionsHooks : function(){},          // 在解析options参数之后执行  called after user options are parsed.
                // preDrawHooks : function(){},                   // 在绘制图表之前执行  called before plot draw.
                // postDrawHooks : function(){},                  // 在绘制图表之后执行  called after plot draw.
                // preDrawSeriesHooks : function(){},             // 在绘制每个坐标轴之前执行  called before each series is drawn.
                // postDrawSeriesHooks : function(){},            // 在绘制每个坐标轴之后执行  called after each series is drawn.
                // preDrawLegendHooks : function(){},             // 在绘制图例之前执行，图例就是指图表中的标识 called before the legend is drawn.
                // addLegendRowHooks : function(){},              // 在绘制图例之后执行，所以插件可以在图例表里添加几行  
                //                                                // called at the end of legend draw, so plugins can add rows to the legend table.
                // preSeriesInitHooks : function(){},             // 在数据线初始化之前执行  called before series is initialized.
                // postSeriesInitHooks : function(){},            // 在数据线初始化之后执行  called after series is initialized.
                // preParseSeriesOptionsHooks : function(){},     // 在解析数据线相关参数之前执行  called before series related options are parsed.
                // postParseSeriesOptionsHooks : function(){},    // 在解析数据线相关参数之后执行  called after series related options are parsed.
                // eventListenerHooks : function(){},             // 绘制结束后，将事件绑定到grid区域的顶部  例：    eventListenerHooks.push(['jqplotClick', function(){alert("event")}]);
                //                                                // called at the end of plot drawing, binds listeners to the event canvas which lays on top of the grid area.
            }
        };

        var config = (options) ? mergeChartConfig(chart.Pie.defaults, options) : chart.Pie.defaults;
        config.innerRadius = 0;

        return new Pie(elem, data, config);
    };

    chart.Doughnut = function(elem, data, options) {
        chart.Pie.defaults = {
            margin : { top: 20, right: 40, bottom: 20, left: 40 },
            width : 300,
            height : 250,
            outerRadius : 125,
            innerRadius : 85,
            opacity : 0.8,
            animation : { enabled : true, time : 1000, delayTime : 0 },
            field : { valueField : chart.fields.defaultValue, textField : chart.fields.defaultText}
        };

        var config = (options) ? mergeChartConfig(chart.Pie.defaults, options) : chart.Pie.defaults;
        config.radius = config.outerRadius;
        config.type = chart.pieTypes[0];

        return new Pie(elem, data, config);
    };

    var Pie = function(elem, data, config) {
        self = this;
        this.elem = elem;
        this.data = data;
        this.config = config;

        if(self.config.type === chart.pieTypes[1]) {
            this.scale = d3.scale.linear()
                .domain([d3.min(self.data, function(d) {
                    return d[self.config.field.valueField];
                }), d3.max(self.data, function(d) {
                    return d[self.config.field.valueField];
                })])
                .range([self.config.radiusMin, self.config.radius]);
        }


        this.colors = ["#f19181", "#f9cb8f", "#f3f5c4", "#93edd4", "#3cbac8", "#378daf", "#ff8c00"];

        this.arc = d3.svg.arc()
            .outerRadius(function(d) {
                if(self.config.type === chart.pieTypes[0]) {
                    return self.config.radius;
                }
                return self.scale(d.data[self.config.field.valueField]);
            })
            .innerRadius(function(d) {
                return self.config.innerRadius;
            });


        this.pie = d3.layout.pie()
            .sort(null)
            // .sort(function(a, b) {
            //     var key = "value";
            //     return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
            // })
            .value(function(d) {
                if(self.config.type === chart.pieTypes[0]) {
                    return d[self.config.field.valueField];
                }
                return 1;
            });
    };

    Pie.prototype.initChart = function() {
        self = this;
        
        var svg = d3.select(self.elem).append("svg")
            .attr("width", self.config.width + self.config.margin.left + self.config.margin.right)
            .attr("height", self.config.height + self.config.margin.top + self.config.margin.bottom)
          .append("g")
            .attr("transform", "translate(" + (self.config.width / 2 + self.config.margin.left) + "," + (self.config.height / 2 + self.config.margin.bottom) + ")");

        var g = svg.selectAll(".arc")
            .data(self.pie(self.data))
          .enter().append("g")
            .attr("class", "arc");

        var path = g.append("path")
            .style("fill", function(d, i) {
                return self.colors[i];
            })
            .style("opacity", self.config.opacity);

        if(self.config.animation && self.config.animation.enabled) {
            path.transition()
                .ease("bounce")
                .delay(self.config.animation.delayTime)
                .duration(self.config.animation.time)
                .attrTween('d', function(d, i) {
                    var i = d3.interpolate(extend({}, d, { endAngle: 0, startAngle: 0}), d);
                    return function (t) { return self.arc(i(t)); };
                })
                .each('end', function(d, i) {
                    i == self.data.length - 1;
                });
        }

        return self;
    };

    function extend() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && isFunction(target) ) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if ( length === i ) {
            target = this;
            --i;
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && (copyIsArray = isArray(copy)) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src;
                        }

                        // Never move original objects, clone them
                        target[ name ] = extend( deep, clone, copy );

                    // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };
    
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

    function isFunction(obj) {
        return typeof obj === "function";
    };

    function mergeChartConfig(defaults, userDefined) {
        var returnObj = {};
        for (var attrname in defaults) {
            returnObj[attrname] = defaults[attrname];
        }
        for (var attrname in userDefined) {
            if (returnObj[attrname] && typeof userDefined[attrname] === "object" && !isArray(userDefined[attrname])) {
                for (var child in userDefined[attrname]) {
                    returnObj[attrname][child] = userDefined[attrname][child];
                };
            } else {
                returnObj[attrname] = userDefined[attrname];
            }
        }
        return returnObj;
    };

    // if (typeof define === "function" && define.amd) {
    //     define(chart);
    // } else if (typeof module === "object" && module.exports) {
    //     module.exports = chart;
    // } else {
    //     this.jChart = chart;
    // }
    //return chart;
}
