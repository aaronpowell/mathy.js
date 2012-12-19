# Mathy.js

[![Build Status](https://travis-ci.org/aaronpowell/mathy.js.png)](https://travis-ci.org/aaronpowell/mathy.js)

Mathy.js is a simple arithmetic calculation engine for node.js and the browser.

It allows you to easily produce parameterized formulas and then get out the results based on what is passed in. It can also be used to execute a string as a formula. The library was written in [TypeScript](http://www.typescriptlang.org) mostly because I wanted to see what it was like to write something in TypeScript. Don't worry though, the contents of the `src` folder includes the generated JavaScript as well as the source maps if you _really_ want to debug the TypeScript.

_Site note: The minified versions source map doesn't match by to the TypeScript source map as I can't get that working yet._

# Install

This can be used as either a node.js package or in the browser.

Node.js:
    
    npm install mathy

Browser:

    <script src="/lib/mathy.js"></script>

# Usage

    var mathy = require('mathy');
    
    var engine = new mathy.Engine({
        name: 'a',
        derivation: '1 + 2'
    });
    
    var result = engine.process();
    
    expect(result[0]).toEqual(3);

Alternatively you can provide parameters to formulas if you have something more complex to evaluate:

    var engine = new mathy.Engine(
        { name: 'a', derivation: 'b * c / d ', result: true }, //Make sure you setup one parameter to be the output
        { name: 'b', derivation: 'e + f' },
        { name: 'c', derivation: '30' }
        );

    engine.add({ name: 'd', derivation: '2' });
    engine.add({ name: 'e', derivation: '10' });
    engine.add({ name: 'f', derivation: 'e * 2' });

    var result = engine.process();

    expect(result[0]).toEqual(450);

## Parmaters

While mathy is designed around mathematical formula parsing it does have a few more advanced features for dealing with _smart_ parameters.

### Binary choice parameters

Mathy supports the idea of a binary choice, or decision, parameter, allowing you to have a parameter like this:

    {
        name: 'foo',
        derivation: '1 === 1 ? 42 : 13'
    }

The evaluation of this decision will be `42`. The left and right sides of the decision can be made up of static values or they can be made up of other parameters, meaning you can have a decision like this:

    var engine = new mathy.Engine(
        { name: 'a', derivation: 'b === 1 ? 1 : -1', result: true },
        { name: 'b', derivation: '1' }
    );

    var result = engine.process();

    expect(result[0]).to.equal(1);

You can even get really complex and have decisions that the result of them is another parameter:

    var engine = new mathy.Engine(
        { name: 'a', derivation: 'd ? b : c', result: true },
        { name: 'b', derivation: '1' },
        { name: 'c', derivation: '-1' },
        { name: 'd', derivation: 'c === 1 ? true : false'}
    );

    var result = engine.process();

    expect(result[0]).to.equal(-1);

# CLI

Mathy also comes with a CLI interface. It can be installed like so:

    npm install -g mathy

And used like this:

    mathy "1 * 2 / 6 * 10 ^ 5"

_Note: Some shells attempt to evaluate expressions so if you want to ensure it's not parsed by your shell make sure it's escaped._

# License

MIT

# Author

Aaron Powell