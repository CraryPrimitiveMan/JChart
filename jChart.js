(function() {
    var UNDEFINED,
        doc = document,
        win = window,
        math = Math,
        mathRound = math.round,
        mathFloor = math.floor,
        mathCeil = math.ceil,
        mathMax = math.max,
        mathMin = math.min,
        mathAbs = math.abs,
        mathCos = math.cos,
        mathSin = math.sin,
        mathPI = math.PI,
        dc = {
            'propExtend': function(o, p) {
                var op = o.prototype,
                    pp = p.prototype;
                for (prop in pp) {
                    if (op.hasOwnProperty[prop]) continue;
                    op[prop] = pp[prop];
                };
                return o;
            }
        };
    var baseChart = function baseChart() {}

    $.fn.jChart = function() {};
}());
