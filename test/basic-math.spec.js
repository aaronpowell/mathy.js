var expect = require('chai').expect;

describe('basic arithmatic operations', function () {
    var mathy = require('../index.js');

    describe('addition', function () {
        it('should add two numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '1 + 2' });

            var result = engine.process();

            expect(result[0]).to.equal(3);
        });

        it('should add three numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '1 + 2 + 3' });

            var result = engine.process();

            expect(result[0]).to.equal(6);
        });

        it('should add heaps numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '1 + 2 + 3 + 4 + 5 + 6 + 7' });

            var result = engine.process();

            expect(result[0]).to.equal(28);
        });
    });

    describe('subtraction', function () {
        it('should subtract two numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 - 1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should subtract three numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '3 - 2 - 1' });

            var result = engine.process();

            expect(result[0]).to.equal(0);
        });

        it('should subtract heaps numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '3 - 2 - 1 - 4 - 6 - 8 - 10' });

            var result = engine.process();

            expect(result[0]).to.equal(-28);
        });
    });

    describe('multiplication', function () {
        it('should multiply two numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 * 1' });

            var result = engine.process();

            expect(result[0]).to.equal(2);
        });

        it('should multiply three numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 * 1 * 5' });

            var result = engine.process();

            expect(result[0]).to.equal(10);
        });

        it('should multiply heaps numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 * 1 * 5 * 3 * 7 * 8 * 3' });

            var result = engine.process();

            expect(result[0]).to.equal(5040);
        });
    });

    describe('division', function () {
        it('should divide two numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 / 2' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should divide three numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 / 10 / 5' });

            var result = engine.process();

            expect(result[0]).to.equal(0.04);
        });

        it('should divide heaps numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 / 1 / 5 / 3 / 7 / 8 / 3' });

            var result = engine.process();

            expect(result[0]).to.equal(0.0007936507936507935);
        });
    });

    describe('parenthesis', function () {
        it('should add numbers in parenthesis', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '(2+2)' });

            var result = engine.process();

            expect(result[0]).to.equal(4);
        });

        it('should add numbers in parenthesis', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '(2+2+2)' });

            var result = engine.process();

            expect(result[0]).to.equal(6);
        });

        it('should allow multiple parenthesis groups', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '(2+2) + (2+2)' });

            var result = engine.process();

            expect(result[0]).to.equal(8);
        });
    });

    describe('power of', function () {
        it('should calculate power of', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '10^2' });

            var result = engine.process();

            expect(result[0]).to.equal(100);
        });

        it('should calculate power of as a part of a fomula', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 * 10^2' });

            var result = engine.process();

            expect(result[0]).to.equal(200);
        });
    });

    describe('negative numbers', function () {
        it('should be able to add negative numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 + -1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should be able to handle negative powers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '10 ^ (-1)' });

            var result = engine.process();

            expect(result[0]).to.equal(0.1);
        });

        it('should be able to handle negative powers with multiplication', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 * 10 ^ (-2)' });

            var result = engine.process();

            expect(result[0]).to.equal(0.02);
        });
    });

    it('supports float values', function () {
        var engine = new mathy.Engine({
            name: 'a',
            derivation: '3.2 * 10 ^ (-2)'
        });

        var result = engine.process();

        expect(result[0]).to.equal(0.032);
    });
    
    it('should handle zero as an argument', function () {
		var engine = new mathy.Engine({
			name: 'a',
			derivation: '0'
		});

		var result = engine.process();

		expect(result[0]).to.equal(0);
		expect(result[0]).to.be.a('number');
	});
});