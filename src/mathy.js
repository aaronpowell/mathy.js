'use strict';
(function (mathy) {
    var cleaner = /\s+/gi;

    var Engine = (function () {
        function Engine() {
            var rules = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                rules[_i] = arguments[_i + 0];
            }
            this.version = '0.2.3';
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
            var outputs = {};
            for (var i = 0; i < results.length; i += 1) {
                node = buildCalculation(results[i].derivation, rules);
                outputs[i] = calculate(node);
                outputs[results[i].name] = node;
            }
            return outputs;
        };
        return Engine;
    })();
    mathy.Engine = Engine;

    var groupCount = 0;

    function resolveParentesis(node, group, part, rules) {
        if (node.type === calculationType.placeholder && node.value === group) {
            node.type = calculationType.group;
            node.children.push(buildCalculation(part, rules));
            return true;
        } else {
            for (var i = 0; i < node.children.length; i += 1) {
                if (resolveParentesis(node.children[i], group, part, rules)) {
                    return true;
                }
            }
        }
        return false;
    }

    function resolveDecision(index, rule, rules) {
        var condition = rule.slice(0, index);
        var parts = rule.slice(index + 1).split(':');
        var calc = new Calculation(calculationType.decision);
        var next = '';

        if (condition.toLowerCase() === 'true') {
            calc.children.push(new Calculation(calculationType.boolean, true));
        } else if (condition.toLowerCase() === 'false') {
            calc.children.push(new Calculation(calculationType.boolean, false));
        } else {
            var decisionCalc;
            index = condition.indexOf('==');
            if (~index) {
                decisionCalc = new Calculation(calculationType.equal);
                decisionCalc.children.push(buildCalculation(condition.slice(0, index), rules));
                decisionCalc.children.push(buildCalculation(condition.slice(index + 2), rules));
            } else if (~(index = condition.indexOf('!='))) {
                decisionCalc = new Calculation(calculationType.notEqual);
                decisionCalc.children.push(buildCalculation(condition.slice(0, index), rules));
                decisionCalc.children.push(buildCalculation(condition.slice(index + 2), rules));
            } else if (~(index = condition.indexOf('<'))) {
                next = condition.slice(index + 1, index + 2);
                if (next === '=') {
                    decisionCalc = new Calculation(calculationType.lessThanEqual);
                    decisionCalc.children.push(buildCalculation(condition.slice(0, index), rules));
                    decisionCalc.children.push(buildCalculation(condition.slice(index + 2), rules));
                } else {
                    decisionCalc = new Calculation(calculationType.lessThan);
                    decisionCalc.children.push(buildCalculation(condition.slice(0, index), rules));
                    decisionCalc.children.push(buildCalculation(condition.slice(index + 1), rules));
                }
            } else if (~(index = condition.indexOf('>'))) {
                next = condition.slice(index + 1, index + 2);
                if (next === '=') {
                    decisionCalc = new Calculation(calculationType.greaterThanEqual);
                    decisionCalc.children.push(buildCalculation(condition.slice(0, index), rules));
                    decisionCalc.children.push(buildCalculation(condition.slice(index + 2), rules));
                } else {
                    decisionCalc = new Calculation(calculationType.greaterThan);
                    decisionCalc.children.push(buildCalculation(condition.slice(0, index), rules));
                    decisionCalc.children.push(buildCalculation(condition.slice(index + 1), rules));
                }
            } else {
                decisionCalc = buildCalculation(condition, rules);
            }

            calc.children.push(decisionCalc);
        }

        if (parts.length) {
            calc.children.push(buildCalculation(parts[0], rules));
            calc.children.push(buildCalculation(parts[1], rules));
        } else {
            calc.children.push(new Calculation(calculationType.value, true));
            calc.children.push(new Calculation(calculationType.value, false));
        }

        return calc;
    }

    function buildCalculation(rule, rules) {
        var index;
        var part1;
        var part2;
        var calc;

        if (typeof rule === 'number') {
            rule = rule + '';
        } else if (typeof rule !== 'string') {
            throw 'The type ' + typeof rule + ' is not supported as a derivation at the present';
        }

        rule = rule.replace(cleaner, '');

        index = rule.lastIndexOf('(');

        if (~index) {
            var end = index + rule.slice(index).indexOf(')');

            part1 = rule.slice(0, index);
            part2 = rule.slice(index + 1, end);
            var part3 = rule.slice(end + 1);

            calc = new Calculation(calculationType.group);
            var group = ++groupCount;
            calc.children.push(buildCalculation(part1 + '$' + group + part3, rules));
            resolveParentesis(calc.children[0], group, part2, rules);
            return calc;
        }

        index = rule.indexOf('?');

        if (~index) {
            return resolveDecision(index, rule, rules);
        }

        index = rule.lastIndexOf('+');

        if (~index) {
            calc = new Calculation(calculationType.add);

            part1 = rule.slice(0, index).trim();
            if (part1) {
                calc.children.push(buildCalculation(part1, rules));
            }

            part2 = rule.slice(index + 1).trim();
            if (part2) {
                calc.children.push(buildCalculation(part2, rules));
            }

            return calc;
        }

        index = rule.lastIndexOf('-');

        if (~index) {
            calc = new Calculation(calculationType.subtraction);

            part1 = rule.slice(0, index).trim();
            calc.children.push(buildCalculation(part1, rules));

            part2 = rule.slice(index + 1).trim();
            if (part2) {
                calc.children.push(buildCalculation(part2, rules));
            }

            return calc;
        }

        index = rule.lastIndexOf('*');

        if (~index) {
            calc = new Calculation(calculationType.multiply);

            part1 = rule.slice(0, index).trim();
            if (part1) {
                calc.children.push(buildCalculation(part1, rules));
            }

            part2 = rule.slice(index + 1).trim();
            if (part2) {
                calc.children.push(buildCalculation(part2, rules));
            }

            return calc;
        }

        index = rule.lastIndexOf('/');

        if (~index) {
            calc = new Calculation(calculationType.division);

            part1 = rule.slice(0, index).trim();
            if (part1) {
                calc.children.push(buildCalculation(part1, rules));
            }

            part2 = rule.slice(index + 1).trim();
            if (part2) {
                calc.children.push(buildCalculation(part2, rules));
            }

            return calc;
        }

        index = rule.lastIndexOf('^');

        if (~index) {
            calc = new Calculation(calculationType.power);

            part1 = rule.slice(0, index).trim();
            if (part1) {
                calc.children.push(buildCalculation(part1, rules));
            }

            part2 = rule.slice(index + 1).trim();
            if (part2) {
                calc.children.push(buildCalculation(part2, rules));
            }

            return calc;
        }

        if (rule[0] === '$') {
            return new Calculation(calculationType.placeholder, parseInt(rule.slice(1), 10));
        }

        var param = rules.filter(function (r) {
            return r.name === rule;
        })[0];
        if (param) {
            rule = param.derivation;
            return buildCalculation(rule, rules);
        }

        rule = rule.trim();
        return new Calculation(calculationType.value, isNaN(parseFloat(rule)) ? (rule === 'true' ? true : rule === 'false' ? false : rule) : parseFloat(rule));
    }

    function calculate(node) {
        if (!node) {
            return 0;
        }

        for (var i = 0; i < node.children.length; i += 1) {
            calculate(node.children[i]);
        }

        switch (node.type) {
            case calculationType.add:
                return node.value = node.children[0].value + node.children[1].value;

            case calculationType.subtraction:
                return node.value = node.children[0].value - node.children[1].value;

            case calculationType.multiply:
                return node.value = node.children[0].value * node.children[1].value;

            case calculationType.division:
                return node.value = node.children[0].value / node.children[1].value;

            case calculationType.group:
                return node.value = calculate(node.children[0]);

            case calculationType.power:
                return node.value = Math.pow(node.children[0].value, node.children[1].value);

            case calculationType.value:
                return node.value = node.source;

            case calculationType.decision:
                return node.value = (node.children[0].value ? node.children[1].value : node.children[2].value);

            case calculationType.boolean:
                return node.value;

            case calculationType.equal:
                return node.value = node.children[0].value === node.children[1].value;

            case calculationType.notEqual:
                return node.value = node.children[0].value !== node.children[1].value;

            case calculationType.lessThanEqual:
                return node.value = node.children[0].value <= node.children[1].value;

            case calculationType.lessThan:
                return node.value = node.children[0].value < node.children[1].value;

            case calculationType.greaterThanEqual:
                return node.value = node.children[0].value >= node.children[1].value;

            case calculationType.greaterThan:
                return node.value = node.children[0].value > node.children[1].value;
        }

        return 0;
    }

    var Calculation = (function () {
        function Calculation(type, value) {
            if (typeof value === "undefined") { value = 0; }
            this.type = type;
            this.value = value;
            this.children = [];
            this.source = 0;
            this.source = value;
        }
        Calculation.prototype.toString = function () {
            var str = '';

            if (this.children[0]) {
                str += this.children[0].toString();
            }

            switch (this.type) {
                case calculationType.add:
                    str += ' + ';
                    break;

                case calculationType.subtraction:
                    str += ' -';
                    break;

                case calculationType.multiply:
                    str += ' * ';
                    break;

                case calculationType.division:
                    str += ' / ';
                    break;

                case calculationType.group:
                    str += '(';
                    break;

                case calculationType.power:
                    str += '^';
                    break;

                case calculationType.value:
                    str += this.value;
                    break;
            }

            if (this.children[1]) {
                str += this.children[1].toString();
            }

            return str;
        };
        return Calculation;
    })();
    mathy.Calculation = Calculation;

    (function (calculationType) {
        calculationType[calculationType["add"] = 0] = "add";
        calculationType[calculationType["subtraction"] = 1] = "subtraction";
        calculationType[calculationType["multiply"] = 2] = "multiply";
        calculationType[calculationType["division"] = 3] = "division";
        calculationType[calculationType["group"] = 4] = "group";
        calculationType[calculationType["power"] = 5] = "power";
        calculationType[calculationType["value"] = 6] = "value";
        calculationType[calculationType["placeholder"] = 7] = "placeholder";
        calculationType[calculationType["decision"] = 8] = "decision";
        calculationType[calculationType["boolean"] = 9] = "boolean";
        calculationType[calculationType["equal"] = 10] = "equal";
        calculationType[calculationType["notEqual"] = 11] = "notEqual";
        calculationType[calculationType["lessThanEqual"] = 12] = "lessThanEqual";
        calculationType[calculationType["lessThan"] = 13] = "lessThan";
        calculationType[calculationType["greaterThanEqual"] = 14] = "greaterThanEqual";
        calculationType[calculationType["greaterThan"] = 15] = "greaterThan";
    })(mathy.calculationType || (mathy.calculationType = {}));
    var calculationType = mathy.calculationType;
})(exports.mathy || (exports.mathy = {}));
var mathy = exports.mathy;

//# sourceMappingURL=mathy.js.map
