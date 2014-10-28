/*
 * jt
 * https://github.com/parroit/jt
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var jt = require('../lib/jt.js');

describe('jt', function(){
    it('is defined', function(){
      jt.should.be.a('function');
    });

});
