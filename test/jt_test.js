/*
 * jt
 * https://github.com/parroit/jt
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.should();

var jt = require('../lib/jt.js');
var Cliente = require("./Cliente");
var t = require('rtts-assert');

class Structure {
    constructor(args) {
        this.args = args;
    }
}

var Sex = jt.Enum('Sex', ['male', 'female']);
var Person = jt.Structure('Person', {
    name: jt.string.size(2),
    sex: Sex
});

class get {}


@Structure
class Test extends Structure {@get text() {
        return this.args.text;
    }

    constructor(text: string) {
        super({
            text
        });
    }
}

describe('jt', () => {
    it('is defined', () => {
        jt.should.be.a('object');
    });

    it('has Cliente class', () => {
        Cliente.should.be.a('function');
    });

    it('it works', () => {
        var t = new Test('aa');
        t.text().should.be.equal('aa');
    });

    it('check structure', () => {
        var t = new Cliente({
            description: 'Eban',
            cliente: true
        });
        t.description.should.be.equal('Eban');
    });

    it('check enums', () => {
        expect(() =>
            new Person({
                name: 'An',
                sex: 'true'
            })
        ).to.throws(Error);
    });

    it('accept enums', () => {
        var p = new Person({
            name: 'An',
            sex: 'male'
        });
        p.sex.should.be.equal('male');
        jt.debug(p)
    });


    it('set default values', () => {
        var t = new Cliente({
            description: 'Eban'
        });
        jt.debug(t)
        t.cliente.should.be.equal(true);
    });


    it('check maxlength', () => {
        expect(() => new Cliente({
            description: 'Eban++'
        })).to.throws(Error);
    });

    it('check minlength', () => {
        expect(() => new Cliente({
            description: 'Eban',
            codiceFiscale: '-'
        })).to.throws(Error);
    });

    it('check size', () => {
        expect(() => new Cliente({
            description: 'Eban',
            partitaIva: '-'
        })).to.throws(Error);
    });

    it('check arguments', () => {
        expect(() => {
            Test(12);
        }).to.throws(Error);

    });

    it('concatenation of type modifiers works', () => {
        expect(() => new Cliente({
            description: 'Eban',
            indirizzo: 'Via Casata'
        })).to.throws(Error);

    });

});
