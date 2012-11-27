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
                node = buildCalculation(rules[i].derivation);
                outputs.push(calculate(node));
            }
            return outputs;
        }
    }

    function buildCalculation(rule: string) {
        var index: number;
        var part1: string;
        var part2: string;
        var calc: Calculation;

        index = rule.indexOf('(');

        if (~index) {
            var end: number;
            var counter = 0;
            var open = -1;
            var close = -1;
            var text = rule.slice(index);
            for(;;) {
                open = text.indexOf('(', ++open);
                close = text.indexOf(')', ++close);
                if (!~open && !~close) {
                    end = -1;
                    break;
                }

                if (~open) {
                    counter++;
                    close = 0;
                } else if (~close) {
                    counter--;
                    open = 0;
                }

                if (!counter) {
                    end = (open ? open : close);
                    break;
                }
            }

            text = rule.slice(index + 1, end);
            calc = new Calculation(calculationType.group);
            calc.children.push(buildCalculation(text));
            return calc;
        }

        index = rule.lastIndexOf('+');

        if (~index) {
            calc = new Calculation(calculationType.add);

            part1 = rule.slice(0, index);
            if (part1) {
                calc.children.push(buildCalculation(part1));
            }

            part2 = rule.slice(index + 1);
            if (part2) {
                calc.children.push(buildCalculation(part2));
            }

            return calc;
        }

        index = rule.lastIndexOf('-');

        if (~index) {
            calc = new Calculation(calculationType.subtraction);

            part1 = rule.slice(0, index);
            if (part1) {
                calc.children.push(buildCalculation(part1));
            }

            part2 = rule.slice(index + 1);
            if (part2) {
                calc.children.push(buildCalculation(part2));
            }

            return calc;
        }

        index = rule.lastIndexOf('*');

        if (~index) {
            calc = new Calculation(calculationType.multiply);

            part1 = rule.slice(0, index);
            if (part1) {
                calc.children.push(buildCalculation(part1));
            }

            part2 = rule.slice(index + 1);
            if (part2) {
                calc.children.push(buildCalculation(part2));
            }

            return calc;
        }

        index = rule.lastIndexOf('/');

        if (~index) {
            calc = new Calculation(calculationType.division);

            part1 = rule.slice(0, index);
            if (part1) {
                calc.children.push(buildCalculation(part1));
            }

            part2 = rule.slice(index + 1);
            if (part2) {
                calc.children.push(buildCalculation(part2));
            }

            return calc;
        }

        index = rule.lastIndexOf('^');

        if (~index) {
            calc = new Calculation(calculationType.power);

            part1 = rule.slice(0, index);
            if (part1) {
                calc.children.push(buildCalculation(part1));
            }

            part2 = rule.slice(index + 1);
            if (part2) {
                calc.children.push(buildCalculation(part2));
            }

            return calc;
        }

        return new Calculation(calculationType.value, parseInt(rule, 10));
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
        value
    }
}