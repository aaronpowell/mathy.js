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
        Engine.prototype.add = function () {
            var newRules = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                newRules[_i] = arguments[_i + 0];
            }
            var rules = this.getRules();
            rules.push.apply(rules, newRules);
        };
        Engine.prototype.process = function () {
            var rules = this.getRules();
            var results = rules.length === 1 ? rules : rules.filter(function (r) {
                return r.result;
            }, []);
            var node;
            var outputs = [];
            for(var i = 0; i < results.length; i += 1) {
                node = buildCalculation(results[i].derivation.replace(/\s+/gi, ''), rules);
                outputs.push(calculate(node));
            }
            return outputs;
        };
        return Engine;
    })();
    mathy.Engine = Engine;    
    var groupCount = 0;
    function findParenthesis(text) {
        var counter = 0;
        var close = -1;
        for(; ; ) {
            close = text.indexOf(')', ++close);
            if(!~close) {
                return -1;
            }
            return close;
        }
    }
    function resolveParentesis(node, group, part, rules) {
        if(node.type === calculationType.placeholder && node.value === group) {
            node.type = calculationType.group;
            node.children.push(buildCalculation(part, rules));
            return true;
        } else {
            for(var i = 0; i < node.children.length; i += 1) {
                if(resolveParentesis(node.children[i], group, part, rules)) {
                    return true;
                }
            }
        }
        return false;
    }
    function buildCalculation(rule, rules) {
        var index;
        var part1;
        var part2;
        var calc;
        index = rule.lastIndexOf('(');
        if(~index) {
            var end = index + findParenthesis(rule.slice(index));
            part1 = rule.slice(0, index);
            part2 = rule.slice(index + 1, end);
            var part3 = rule.slice(end + 1);
            calc = new Calculation(calculationType.group);
            var group = ++groupCount;
            calc.children.push(buildCalculation(part1 + '$' + group + part3, rules));
            resolveParentesis(calc.children[0], group, part2, rules);
            return calc;
        }
        index = rule.lastIndexOf('+');
        if(~index) {
            calc = new Calculation(calculationType.add);
            part1 = rule.slice(0, index).trim();
            if(part1) {
                calc.children.push(buildCalculation(part1, rules));
            }
            part2 = rule.slice(index + 1).trim();
            if(part2) {
                calc.children.push(buildCalculation(part2, rules));
            }
            return calc;
        }
        index = rule.lastIndexOf('-');
        if(~index) {
            calc = new Calculation(calculationType.subtraction);
            part1 = rule.slice(0, index).trim();
            calc.children.push(buildCalculation(part1, rules));
            part2 = rule.slice(index + 1).trim();
            if(part2) {
                calc.children.push(buildCalculation(part2, rules));
            }
            return calc;
        }
        index = rule.lastIndexOf('*');
        if(~index) {
            calc = new Calculation(calculationType.multiply);
            part1 = rule.slice(0, index).trim();
            if(part1) {
                calc.children.push(buildCalculation(part1, rules));
            }
            part2 = rule.slice(index + 1).trim();
            if(part2) {
                calc.children.push(buildCalculation(part2, rules));
            }
            return calc;
        }
        index = rule.lastIndexOf('/');
        if(~index) {
            calc = new Calculation(calculationType.division);
            part1 = rule.slice(0, index).trim();
            if(part1) {
                calc.children.push(buildCalculation(part1, rules));
            }
            part2 = rule.slice(index + 1).trim();
            if(part2) {
                calc.children.push(buildCalculation(part2, rules));
            }
            return calc;
        }
        index = rule.lastIndexOf('^');
        if(~index) {
            calc = new Calculation(calculationType.power);
            part1 = rule.slice(0, index).trim();
            if(part1) {
                calc.children.push(buildCalculation(part1, rules));
            }
            part2 = rule.slice(index + 1).trim();
            if(part2) {
                calc.children.push(buildCalculation(part2, rules));
            }
            return calc;
        }
        if(rule[0] === '$') {
            return new Calculation(calculationType.placeholder, parseInt(rule.slice(1), 10));
        }
        var param = rules.filter(function (r) {
            return r.name === rule;
        })[0];
        if(param) {
            rule = param.derivation;
            return buildCalculation(rule, rules);
        }
        rule = rule.trim();
        return new Calculation(calculationType.value, parseInt(rule, 10) || null);
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
            case calculationType.division: {
                return node.value = node.children[0].value / node.children[1].value;

            }
            case calculationType.group: {
                return node.value = calculate(node.children[0]);

            }
            case calculationType.power: {
                return node.value = Math.pow(node.children[0].value, node.children[1].value);

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
        calculationType._map[3] = "division";
        calculationType.division = 3;
        calculationType._map[4] = "group";
        calculationType.group = 4;
        calculationType._map[5] = "power";
        calculationType.power = 5;
        calculationType._map[6] = "value";
        calculationType.value = 6;
        calculationType._map[7] = "placeholder";
        calculationType.placeholder = 7;
    })(calculationType || (calculationType = {}));
})(exports.mathy || (exports.mathy = {}));
var mathy = exports.mathy;
//@ sourceMappingURL=mathy.js.map
