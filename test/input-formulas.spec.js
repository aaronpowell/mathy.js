var expect = require('chai').expect;

describe('Formula\'s can be broken down by parameters', function () {
    var mathy = require('../index.js');

    it('should allow a single additional parameter to be passed in', function () {
        var engine = new mathy.Engine({
                name: 'a',
                derivation: 'b',
                result: true
            }, {
                name: 'b',
                derivation: '1'
            });

        var result = engine.process();

        expect(result[0]).to.equal(1);
    });

    it('should use supplied parameter in formula', function () {
        var engine = new mathy.Engine({
                name: 'a',
                derivation: 'b + 2',
                result: true
            }, {
                name: 'b',
                derivation: '1'
            });

        var result = engine.process();

        expect(result[0]).to.equal(3);
    });

    it('should allow parameter reuse', function () {
        var engine = new mathy.Engine({
                name: 'a',
                derivation: 'b + b',
                result: true
            }, {
                name: 'b',
                derivation: '1'
            });

        var result = engine.process();

        expect(result[0]).to.equal(2);
    });

    it('should allow deep parameters', function () {
        var engine = new mathy.Engine({
                name: 'a',
                derivation: 'b',
                result: true
            }, {
                name: 'b',
                derivation: 'c'
            }, {
                name: 'c',
                derivation: '1'
            });

        var result = engine.process();

        expect(result[0]).to.equal(1);
    });
});