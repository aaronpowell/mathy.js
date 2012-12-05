'use strict';
export module mathy {
    export class Engine {
        getRules: () => rule[];
        constructor(...rules: rule[]) {
            this.getRules = () => rules;
        }

        add(rule: rule) {
            this.getRules().push(rule);
        }

        process() {
            var rules = this.getRules();
            var results = rules.length === 1 ? rules : rules.filter(function (r) { return r.result; }, []);
            var node: Calculation;
            var outputs: number[] = [];
            for(var i = 0; i < results.length; i += 1) {
                node = buildCalculation(results[i].derivation.replace(/\s+/gi, ''), rules);
                outputs.push(calculate(node));
            }
            return outputs;
        }
    }

    var groupCount = 0;

    function findParenthesis(text) {
        var counter = 0;
        var close = -1;
        for(;;) {
            close = text.indexOf(')', ++close);
            if (!~close) {
                return -1;
            }

            return close;
        }
    }

    function resolveParentesis(node: Calculation, group: number, part: string, rules: rule[]) {
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

    function buildCalculation(rule: string, rules: rule[]) {
        var index: number;
        var part1: string;
        var part2: string;
        var calc: Calculation;

        index = rule.lastIndexOf('(');

        if (~index) {
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

        var param = rules.filter(function (r) { return r.name === rule; })[0];
        if (param) {
            rule = param.derivation;
            return buildCalculation(rule, rules);
        }

        rule = rule.trim();
        return new Calculation(calculationType.value, parseInt(rule, 10) || null);
    }

    function calculate(node: Calculation) {
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
                return node.value;
        }

        return 0;
    }

    export interface rule {
        name: string;
        derivation: string;
        result: Boolean;
    }

    class Calculation {
        constructor(public type?: calculationType, public value: number = 0, public children?: Calculation[] = []) {
        }
    }

    enum calculationType {
        add,
        subtraction,
        multiply,
        division,
        group,
        power,
        value,
        placeholder
    }
}