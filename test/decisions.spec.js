var expect = require('chai').expect;

describe('parameter decisions', function () {
    var mathy = require('../index.js');

    describe('single depth decision', function () {
        it('should be able to evaulate the first argument to true', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: 'true ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should be able to evaulate the first argument to false', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: 'false ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(-1);
        });

        it('should allow a dynamic decision to false', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: 'foo == bar ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(-1);
        });

        it('should allow a dynamic decision to true', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: 'foo == foo ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });
    });

    describe('decisions and parameters', function () {
        it('should allow an additional parameter to be a decision', function () {
            var engine = new mathy.Engine(
                { name: 'a', derivation: 'b + 1', result: true },
                { name: 'b', derivation: 'true ? 1 : 0' }
            );

            var result = engine.process();

            expect(result[0]).to.equal(2);
        });

        it('should allow part of the decision input to be a parameter', function () {
            var engine = new mathy.Engine(
                { name: 'a', derivation: 'b == 1 ? 1 : -1', result: true },
                { name: 'b', derivation: '1' }
            );

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should handle the result of a decision being a parameter', function () {
            var engine = new mathy.Engine(
                { name: 'a', derivation: 'true ? b : c', result: true },
                { name: 'b', derivation: '1' },
                { name: 'c', derivation: '-1' }
            );

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should handle a decisions input parameter being a decision', function () {
            var engine = new mathy.Engine(
                { name: 'a', derivation: 'd ? b : c', result: true },
                { name: 'b', derivation: '1' },
                { name: 'c', derivation: '-1' },
                { name: 'd', derivation: 'c == -1 ? true : false'}
            );

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should handle a decisions input parameter being a decision with a false value', function () {
            var engine = new mathy.Engine(
                { name: 'a', derivation: 'd ? b : c', result: true },
                { name: 'b', derivation: '1' },
                { name: 'c', derivation: '-1' },
                { name: 'd', derivation: 'c == 1 ? true : false'}
            );

            var result = engine.process();

            expect(result[0]).to.equal(-1);
        });
    });

    describe('decisions and parenthesis', function () {
        it('should be fine with the decision in parenthesis', function () {
            var engine = new mathy.Engine(
                { name: 'a', derivation: '(1 == 1) ? 1 : -1' }
            );

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should allow nested decisions when you uses parenthesis', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: 'true ? (false ? 1 : -1) : -2' });

            var result = engine.process();

            expect(result[0]).to.equal(-1);
        });
    });

    describe('decision test operators', function () {
        it('should support equal (==)', function () {
            var engine = new mathy.Engine(
                { name: 'a', derivation: '1 == 1 ? 1 : -1' }
            );

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should support loose inequality (!=)', function () {
            var engine = new mathy.Engine(
                { name: 'a', derivation: '1 != 1 ? 1 : -1' }
            );

            var result = engine.process();

            expect(result[0]).to.equal(-1);
        });

        it('should allow a less-than decision to true', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 < 3 ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should allow a greater-than decision to true', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '3 > 2 ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should allow less-than-or-equal-to decision', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 <= 2 ? 2 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(2);
        });

        it('should allow a greater-than decision to true', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '3 >= 3 ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });
    });
});