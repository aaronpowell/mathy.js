var expect = require('chai').expect;

describe('mathy API', function() {
    var mathy = require('../index.js');

    describe('rule list handling', function () {

        it('should all you to add new rules to an existing engine', function () {
            var engine = new mathy.Engine();

            engine.add({ name: 'a', derivation: '1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should allow you to add new parameters to an existing rule', function () {
            var engine = new mathy.Engine(
                { name: 'a', derivation: 'b * c / d ', result: true },
                { name: 'b', derivation: 'e + f' },
                { name: 'c', derivation: '30' }
            );

            engine.add({ name: 'd', derivation: '2' });
            engine.add({ name: 'e', derivation: '10' });
            engine.add({ name: 'f', derivation: 'e * 2' });

            var result = engine.process();

            expect(result[0]).to.equal(450);
        });

        it('should allow you to add multiple parameters at the one time', function () {
            var engine = new mathy.Engine(
                { name: 'a', derivation: 'b * c / d ', result: true },
                { name: 'b', derivation: 'e + f' },
                { name: 'c', derivation: '30' }
            );

            engine.add(
                { name: 'd', derivation: '2' },
                { name: 'e', derivation: '10' },
                { name: 'f', derivation: 'e * 2' }
            );

            var result = engine.process();

            expect(result[0]).to.equal(450);
        });
    });

    describe('AST', function () {
        it('should allow you to access the AST', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '1 + 1' });

            var result = engine.process();

            expect(result.a).to.exist;
        });

        it('should have the same value as the result in the AST root', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '1 + 1' });

            var result = engine.process();

            expect(result.a.value).to.equal(result[0]);
        });

        it('should have a walkable AST', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '1 + 2' });

            var result = engine.process();

            expect(result.a.children[0].value).to.equal(1);
            expect(result.a.children[1].value).to.equal(2);
        });
    });

    describe('parameters', function () {
        it('should allow numbers to be in a parameter', function () {
            var engine = new mathy.Engine({ name: '__out', derivation: '1 + $0', result: true });

            engine.add({ name: '$0', derivation: '1' });

            var result = engine.process();

            expect(result.__out.value).to.equal(2);
        });
    });
});