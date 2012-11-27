'use strict';
export module mathy {
    export class Engine {
        getRules: () => rule[];
        constructor(...rules: rule[]) {
            this.getRules = () => rules;
        }

        process() {
            var rules = this.getRules();
            var node: Calculation;
            var outputs: number[] = [];
            for(var i = 0; i < rules.length; i += 1) {
                node = buildCalculation(rules[i].derivation.replace(/\s+/gi, ''));
                outputs.push(calculate(node));
            }
            return outputs;
        }
    }

    var groupCount = 0;

    function findParenthesis(text) {
        var counter = 0;
        var open = -1;
        var close = -1;
        for(;;) {
            open = text.indexOf('(', ++open);
            close = text.indexOf(')', ++close);
            if (!~open && !~close) {
                return -1;
            }

            if (~open && open < close) {
                counter++;
                close = 0;
            } else if (~close) {
                counter--;
                open = 0;
            }

            if (!counter) {
                return open ? open : close;
            }
        }
    }

    function resolveParentesis(node: Calculation, group: number, part: string) {
        if (node.type === calculationType.placeholder && node.value === group) {
            node.type = calculationType.group;
            node.children.push(buildCalculation(part));
            return true;
        } else {
            for (var i = 0; i < node.children.length; i += 1) {
                if (resolveParentesis(node.children[i], group, part)) {
                    return true;
                }
            }
        }
        return false;
    }

    function buildCalculation(rule: string) {
        var index: number;
        var part1: string;
        var part2: string;
        var calc: Calculation;

        index = rule.indexOf('(');

        if (~index) {
            var end = index + findParenthesis(rule.slice(index));

            part1 = rule.slice(0, index);
            part2 = rule.slice(index + 1, end);
            var part3 = rule.slice(end + 1);

            calc = new Calculation(calculationType.group);
            var group = ++groupCount;
            calc.children.push(buildCalculation(part1 + '$' + group + part3));
            resolveParentesis(calc.children[0], group, part2);
            return calc;
        }

        index = rule.lastIndexOf('+');

        if (~index) {
            calc = new Calculation(calculationType.add);

            part1 = rule.slice(0, index).trim();
            if (part1) {
                calc.children.push(buildCalculation(part1));
            }

            part2 = rule.slice(index + 1).trim();
            if (part2) {
                calc.children.push(buildCalculation(part2));
            }

            return calc;
        }

        index = rule.lastIndexOf('-');

        if (~index) {
            calc = new Calculation(calculationType.subtraction);

            part1 = rule.slice(0, index).trim();
            calc.children.push(buildCalculation(part1));

            part2 = rule.slice(index + 1).trim();
            if (part2) {
                calc.children.push(buildCalculation(part2));
            }

            return calc;
        }

        index = rule.lastIndexOf('*');

        if (~index) {
            calc = new Calculation(calculationType.multiply);

            part1 = rule.slice(0, index).trim();
            if (part1) {
                calc.children.push(buildCalculation(part1));
            }

            part2 = rule.slice(index + 1).trim();
            if (part2) {
                calc.children.push(buildCalculation(part2));
            }

            return calc;
        }

        index = rule.lastIndexOf('/');

        if (~index) {
            calc = new Calculation(calculationType.division);

            part1 = rule.slice(0, index).trim();
            if (part1) {
                calc.children.push(buildCalculation(part1));
            }

            part2 = rule.slice(index + 1).trim();
            if (part2) {
                calc.children.push(buildCalculation(part2));
            }

            return calc;
        }

        index = rule.lastIndexOf('^');

        if (~index) {
            calc = new Calculation(calculationType.power);

            part1 = rule.slice(0, index).trim();
            if (part1) {
                calc.children.push(buildCalculation(part1));
            }

            part2 = rule.slice(index + 1).trim();
            if (part2) {
                calc.children.push(buildCalculation(part2));
            }

            return calc;
        }

        if (rule[0] === '$') {
            return new Calculation(calculationType.placeholder, parseInt(rule.slice(1), 10));
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