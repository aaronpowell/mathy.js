'use strict';
(function (mathy) {
    var Engine = (function () {
        function Engine() {
            var rules = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                rules[_i] = arguments[_i + 0];
            }
            this.getRules = function () {
                return rules;
            };
        }
        Engine.prototype.process = function () {
            var rules = this.getRules();
            var node;
            var outputs = [];
            for(var i = 0; i < rules.length; i += 1) {
                node = buildCalculation(rules[i].derivation);
                outputs.push(calculate(node));
            }
            return outputs;
        };
        return Engine;
    })();
    mathy.Engine = Engine;    
    function buildCalculation(rule) {
        var index;
        var part1;
        var part2;
        var calc;
        index = rule.lastIndexOf('*');
        if(~index) {
            calc = new Calculation(calculationType.multiply);
            part1 = rule.slice(0, index);
            if(part1) {
                calc.children.push(buildCalculation(part1));
            }
            part2 = rule.slice(index + 1);
            if(part2) {
                calc.children.push(buildCalculation(part2));
            }
            return calc;
        }
        index = rule.lastIndexOf('+');
        if(~index) {
            calc = new Calculation(calculationType.add);
            part1 = rule.slice(0, index);
            if(part1) {
                calc.children.push(buildCalculation(part1));
            }
            part2 = rule.slice(index + 1);
            if(part2) {
                calc.children.push(buildCalculation(part2));
            }
            return calc;
        }
        index = rule.lastIndexOf('-');
        if(~index) {
            calc = new Calculation(calculationType.subtraction);
            part1 = rule.slice(0, index);
            if(part1) {
                calc.children.push(buildCalculation(part1));
            }
            part2 = rule.slice(index + 1);
            if(part2) {
                calc.children.push(buildCalculation(part2));
            }
            return calc;
        }
        return new Calculation(calculationType.value, parseInt(rule, 10));
    }
    function calculate(node) {
        if(!node) {
            return 0;
        }
        for(var i = 0; i < node.children.length; i += 1) {
            calculate(node.children[i]);
        }
        switch(node.type) {
            case calculationType.add: {
                return node.value = node.children[0].value + node.children[1].value;

            }
            case calculationType.subtraction: {
                return node.value = node.children[0].value - node.children[1].value;

            }
            case calculationType.multiply: {
                return node.value = node.children[0].value * node.children[1].value;

            }
            case calculationType.value: {
                return node.value;

            }
        }
        return 0;
    }
    var Calculation = (function () {
        function Calculation(type, value, children) {
            if (typeof value === "undefined") { value = 0; }
            if (typeof children === "undefined") { children = []; }
            this.type = type;
            this.value = value;
            this.children = children;
        }
        return Calculation;
    })();    
    var calculationType;
    (function (calculationType) {
        calculationType._map = [];
        calculationType._map[0] = "add";
        calculationType.add = 0;
        calculationType._map[1] = "subtraction";
        calculationType.subtraction = 1;
        calculationType._map[2] = "multiply";
        calculationType.multiply = 2;
        calculationType._map[3] = "value";
        calculationType.value = 3;
    })(calculationType || (calculationType = {}));
})(exports.mathy || (exports.mathy = {}));
var mathy = exports.mathy;
