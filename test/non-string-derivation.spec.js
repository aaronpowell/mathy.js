var expect = require('chai').expect;

describe('non-string derivations', function () {
    var mathy = require('../index.js');
    
    describe('derivation as number', function () {
        it('should allow a number as a derivation', function () {
           var engine = new mathy.Engine({
                name: 'a',
                derivation: 'b',
                result: true
            }, {
                name: 'b',
                derivation: 1
            });

        var result = engine.process();

        expect(result[0]).to.equal(1); 
        });
    })
});