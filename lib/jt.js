/*
 * jt
 * https://github.com/parroit/jt
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */


module.exports = {
    number: assert.number,
    string: assert.string,
    boolean: assert.boolean,
    Structure: Structure,
    Enum: Enum,
    Interface: Interface,
    arrayOf: assert.arrayOf,
    debug: debug
};

assert.number.meta = {
    type: 'Number',
    kind: 'primitive',
    primitive: Number
};

assert.string.meta = {
    type: 'String',
    kind: 'primitive',
    primitive: String
};

assert.boolean.meta = {
    type: 'Boolean',
    kind: 'primitive',
    primitive: Boolean
};


function debug(v) {

    console.log( JSON.stringify(v.constructor.meta,null,4) );

}

function mixinModifiers(type, typeName) {


    type.optional = optional(typeName);
    type.default = defaultValue(typeName);
    type.maxlength = maxlength(typeName);
    type.minlength = minlength(typeName);
    type.size = size(typeName);
    type.label = label(typeName);

}


var maxlength = buildModifier('maxlength', (value, args) => {
    var max = args[0];

    if (value === null || value === undefined) {
        return null;
    }

    if (value.length === undefined) {
        assert.fail('Length of ' + value + ' is undefined');
    }

    if (value.length > max) {
        assert.fail('Length of ' + value + ' is greater than ' + max);
    }

    return null;
},(maxlength) => {return {maxlength};});


var size = buildModifier('size', (value, args) => {
    var l = args[0];

    if (value === null || value === undefined) {
        return null;
    }

    if (value.length === undefined) {
        assert.fail('Length of ' + value + ' is undefined');
    }

    if (value.length !== l) {
        assert.fail('Length of ' + value + ' is different than ' + l);
    }

    return null;
},(size) => {return {size};});

var minlength = buildModifier('minlength', (value, args) => {
    var min = args[0];

    if (value === null || value === undefined) {
        return null;
    }

    if (value.length === undefined) {
        assert.fail('Length of ' + value + ' is undefined');
    }

    if (value.length < min) {
        assert.fail('Length of ' + value + ' is less than ' + min);
    }

    return null;
},(minlength) => {return {minlength};});

var optional = buildModifier('optional', (value, args) => {
    if (value === null || value === undefined) {
        return true;
    }
},() => {return {optional: true};});

var label = buildModifier(
    'label',
    (value, args) => null,
    (label) => {return {label};}
);


function defaultValue(typeName) {
    return function(value) {
        var basicType = this;
        var cnstr = emptyFunction(typeName);
        var type = assert.define(cnstr, (value) => {
            if (value === null || value === undefined) {
                return;
            }
            assert(value).is(basicType);
        });
        type.meta = Object.assign({default: value}, basicType.meta);

        type.defaultValue = value;
        mixinModifiers(type, typeName);
        return type;
    };

}


mixinModifiers(assert.number, 'number');
mixinModifiers(assert.string, 'string');
mixinModifiers(assert.boolean, 'boolean');


function buildModifier(name, validate, metaImprover) {
    return (typeName) => {
        return function() {
            var args = Array.from(arguments);
            var basicType = this;
            var newTypeName = name + '_' + typeName;
            var cnstr = emptyFunction(newTypeName);

            var type = assert.define(cnstr, (value) => {
                var result = validate(value, args);
                if (result === null || result === undefined) {
                    assert(value).is(basicType);
                }
            });

            var improvements = metaImprover.apply(null,args);
            type.meta = Object.assign({}, basicType.meta, improvements);

            mixinModifiers(type, newTypeName);
            return type;
        };
    };
}


function emptyFunction(name, fn) {
    var cnstr;
    //jshint evil:true
    eval('cnstr = function ' + name + '(){' + (fn ? 'return fn.apply(this,arguments);' : '') + '}');
    return cnstr;
}


function Enum(name, values) {

    var type =  assert.define(name, (value) => {
        if ( values.indexOf(value) === -1 ) {
            assert.fail(
                'Expected one of ' +
                values.join(',') +
                ', got ' +
                value
            );
        }
    });

    type.meta = {
        type: name,
        kind: 'enum',
        values: values
    };

    return type;
}


function Interface(name, members) {

    return assert.define(name, (value) => {
    });

}

function Structure(name, fields) {

    var Fields = assert.structure(fields);

    var Struct = emptyFunction(name, function(fieldValues) {
        if (!(this instanceof Struct)) {
            return new Struct(fieldValues);
        }
        assert.argumentTypes(fieldValues, Fields);
        for (var fieldName in fields) {
            var value = fieldValues[fieldName];
            if (fields[fieldName].defaultValue && value === undefined) {
                value = fields[fieldName].defaultValue;
            }
            this[fieldName] = value;
        }
        Object.freeze(this);
    });

    Struct.meta = {
        type: name,
        kind: 'structure',
        fields: []
    };

    for (var fieldName in fields) {

        var meta = fields[fieldName].meta;
        if (meta) {
            meta = Object.assign({},meta);
            if (!meta.label) {
                meta.label = labelize(fieldName);
            }
            meta.name = fieldName;
            Struct.meta.fields.push(meta);
        }
    }

    return Struct;

}

function labelize(name){
    return name
        // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, (str) => str.toUpperCase());
}

/* jshint ignore:start */
class Force {
    constructor(a: number){}
}
/* jshint ignore:end */