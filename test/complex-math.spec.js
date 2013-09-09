var expect = require('chai').expect;

describe('complex arithmatic operations', function () {
    var mathy = require('../index.js');

    it('should handle complex order of operations', function () {
        var engine = new mathy.Engine({ name: 'a', derivation: '1 + 2 * 3 - 16 / 8' });

        var result = engine.process();

        expect(result[0]).to.equal(5);
    });

    it('should handle complex order of operations with powers', function () {
        var engine = new mathy.Engine({ name: 'a', derivation: '1 + 2 * 3 - 1 * 10 ^ 1 / 5' });

        var result = engine.process();

        expect(result[0]).to.equal(5);
    });

    it('should allow calculations in exponents', function () {
        var engine = new mathy.Engine({ name: 'a', derivation: '1 * 10 ^ (1+1)' });

        var result = engine.process();

        expect(result[0]).to.equal(100);
    });

    it('should support two levels of parentesis', function () {
        var engine = new mathy.Engine({ name: 'a', derivation: '(2 + (2))' });

        var result = engine.process();

        expect(result[0]).to.equal(4);
    });

    it('should support multiple levels of parentesis', function () {
        var engine = new mathy.Engine({ name: 'a', derivation: '(2 + (2 + (2)))' });

        var result = engine.process();

        expect(result[0]).to.equal(6);
    });

    it('should support multiple levels of parentesis at any position', function () {
        var engine = new mathy.Engine({ name: 'a', derivation: '1 + (2 + (2 + (2)))' });

        var result = engine.process();

        expect(result[0]).to.equal(7);
    });

    it('should allow decisions inside formulas', function () {
        var engine = new mathy.Engine({ name: 'a', derivation: '1 + (true ? 2 : -1)'});

        var result = engine.process();

        expect(result[0]).to.equal(3);
    });
});