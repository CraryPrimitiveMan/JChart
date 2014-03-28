var jChart = function() {
    var chart = this;

    this.Pie = function(elem, data, options) {
        chart.Pie.defaults = {
            margin : { top: 20, right: 40, bottom: 20, left: 40 },
            width : 300,
            height : 250,
            radius : 125,
            widthMin : 50,
            widthMax : 125,
            lineWidth : 125,
            time : 200,
            opacity : 0.8,
            valueKey : "value",
            textKey : "key"
        };

        var config = (options) ? mergeChartConfig(chart.Pie.defaults, options) : chart.Pie.defaults;

        return new Pie(elem, data, config);
    };

    var Pie = function(elem, data, config) {
        self = this;
        this.elem = elem;
        this.data = data;
        this.config = config;


        this.scale = d3.scale.linear()
            .domain([d3.min(self.data, function(d) {
                return d[self.config.valueKey];
            }), d3.max(self.data, function(d) {
                return d[self.config.valueKey];
            })])
            .range([self.config.widthMin, self.config.widthMax]);


        this.colors = ["#f19181", "#f9cb8f", "#f3f5c4", "#93edd4", "#3cbac8", "#378daf", "#ff8c00"];


        this.arc = d3.svg.arc()
            .outerRadius(function(d) {
                return self.scale(d.data[self.config.valueKey]);
            })
            .innerRadius(function(d) {
                return 0;//radius - scale(d.data.population) / 2;
            });


        this.pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {
                return 1;
            });

        return self;
    }

    Pie.prototype.initChart = function() {
        self = this;
        
        var angleUnit = 0.4;
        var svg = d3.select(self.elem).append("svg")
            .attr("width", self.config.width + self.config.margin.left + self.config.margin.right)
            .attr("height", self.config.height + self.config.margin.top + self.config.margin.bottom)
          .append("g")
            .attr("transform", "translate(" + (self.config.width / 2 + self.config.margin.left) + "," + (self.config.height / 2 + self.config.margin.bottom) + ")");


        var g = svg.selectAll(".arc")
            .data(self.pie(self.data))
          .enter().append("g")
            .attr("class", "arc");


        g.append("path")
            .style("fill", function(d, i) {
                return self.colors[i];
            })
            .style("opacity", self.config.opacity)
            .transition()
            .ease("bounce")
            .duration(self.config.time * 6)
            .attrTween('d', function(d, i) {
                var i = d3.interpolate(extend({}, d, { endAngle: 0, startAngle: 0}), d);//{ endAngle: d.endAngle - Math.PI / 3 * (i + 1), startAngle: d.startAngle - Math.PI / 3 * i }), d);
                return function (t) { return self.arc(i(t)); };
            })
            .each('end', function(d, i) {
                i == self.data.length - 1;
            });
    }

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
    }
    function isFunction(obj) {
        return typeof obj === "function";
    }
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
    }
}
