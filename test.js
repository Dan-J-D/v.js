const v = require('./v.js');

const assert = console.assert;

// numbers
(() => {
	const num = v.number();

	const [err, val] = num.validate(5);
	assert(err.length === 0);
	assert(val === 5);

	num.default(10);
	const [err2, val2] = num.validate(5);
	assert(err2.length === 0);
	assert(val2 === 5);

	num.min(0);
	const [err3, val3] = num.validate(5);
	assert(err3.length === 0);
	assert(val3 === 5);

	num.max(10);
	const [err4, val4] = num.validate(5);
	assert(err4.length === 0);
	assert(val4 === 5);

	num.isWhole();
	const [err5, val5] = num.validate(5);
	assert(err5.length === 0);
	assert(val5 === 5);

	const [err6, val6] = num.validate(5.5);
	assert(err6.length > 0);
	assert(val6 === undefined);

	const [err7, val7] = num.validate('5');
	assert(err7.length > 0);
	assert(val7 === undefined);

	const [err8, val8] = num.validate(11);
	assert(err8.length > 0);
	assert(val8 === undefined);

	const [err9, val9] = num.validate(-1);
	assert(err9.length > 0);
	assert(val9 === undefined);

	const [err10, val10] = num.validate(undefined);
	assert(err10.length === 0);
	assert(val10 === 10);

	const num2 = v.number().optional();
	const [err11, val11] = num2.validate(undefined);
	assert(err11.length === 0);
	assert(val11 === undefined);

	const num3 = v.number().default(5);

	const [err12, val12] = num3.validate(undefined);
	assert(err12.length === 0);
	assert(val12 === 5);
})();

// strings
(() => {
	const str = v.string();

	const [err13, val13] = str.validate('hello');
	assert(err13.length === 0);
	assert(val13 === 'hello');

	str.default('world');
	const [err14, val14] = str.validate('hello');
	assert(err14.length === 0);
	assert(val14 === 'hello');

	str.minlength(3);
	const [err15, val15] = str.validate('hello');
	assert(err15.length === 0);
	assert(val15 === 'hello');

	str.maxlength(5);
	const [err16, val16] = str.validate('hello');
	assert(err16.length === 0);
	assert(val16 === 'hello');

	str.length(5);
	const [err17, val17] = str.validate('hello');
	assert(err17.length === 0);
	assert(val17 === 'hello');

	str.inCharset('helo');
	const [err18, val18] = str.validate('hello');
	assert(err18.length === 0);
	assert(val18 === 'hello');

	const [err19, val19] = str.validate('world');
	assert(err19.length > 0);
	assert(val19 === undefined);

	const [err20, val20] = str.validate('hell');
	assert(err20.length > 0);
	assert(val20 === undefined);

	const [err21, val21] = str.validate('helloo');
	assert(err21.length > 0);
	assert(val21 === undefined);

	const str2 = v.string().optional();
	const [err22, val22] = str2.validate(undefined);
	assert(err22.length === 0);
	assert(val22 === undefined);
})();

// booleans
(() => {
	const bool = v.boolean();

	const [err23, val23] = bool.validate(true);
	assert(err23.length === 0);
	assert(val23 === true);

	bool.default(false);
	const [err24, val24] = bool.validate(true);
	assert(err24.length === 0);
	assert(val24 === true);

	const bool2 = v.boolean().optional();
	const [err25, val25] = bool2.validate(undefined);
	assert(err25.length === 0);
	assert(val25 === undefined);
})();

// arrays
(() => {
	const arr = v.array(v.number());
	const [err26, val26] = arr.validate([1, 2, 3]);
	assert(err26.length === 0);
	assert(val26.length === 3);
	assert(val26[0] === 1);
	assert(val26[1] === 2);
	assert(val26[2] === 3);

	arr.default([4, 5, 6]);
	const [err27, val27] = arr.validate([1, 2, 3]);
	assert(err27.length === 0);
	assert(val27.length === 3);
	assert(val27[0] === 1);
	assert(val27[1] === 2);
	assert(val27[2] === 3);

	arr.minlength(2);
	const [err28, val28] = arr.validate([1, 2, 3]);
	assert(err28.length === 0);
	assert(val28.length === 3);
	assert(val28[0] === 1);
	assert(val28[1] === 2);
	assert(val28[2] === 3);

	arr.maxlength(4);
	const [err29, val29] = arr.validate([1, 2, 3]);
	assert(err29.length === 0);
	assert(val29.length === 3);
	assert(val29[0] === 1);
	assert(val29[1] === 2);
	assert(val29[2] === 3);

	arr.length(3);
	const [err30, val30] = arr.validate([1, 2, 3]);
	assert(err30.length === 0);
	assert(val30.length === 3);
	assert(val30[0] === 1);
	assert(val30[1] === 2);
	assert(val30[2] === 3);

	const [err31, val31] = arr.validate([1, 2, '3']);
	assert(err31.length > 0);
	assert(val31 === undefined);

	const [err32, val32] = arr.validate([1, 2]);
	assert(err32.length > 0);
	assert(val32 === undefined);

	const [err33, val33] = arr.validate([1, 2, 3, 4]);
	assert(err33.length > 0);
	assert(val33 === undefined);

	const [err34, val34] = arr.validate(undefined);
	assert(err34.length === 0);
	assert(val34.length === 3);
	assert(val34[0] === 4);
	assert(val34[1] === 5);
	assert(val34[2] === 6);

	const arr2 = v.array(v.number()).optional();
	const [err35, val35] = arr2.validate(undefined);
	assert(err35.length === 0);
	assert(val35 === undefined);
})();

// objects
(() => {
	const obj = v.object({
		'num': v.number(),
		'str': v.string(),
		'bool': v.boolean()
	});

	const [err36, val36] = obj.validate({
		'num': 5,
		'str': 'hello',
		'bool': true
	});
	assert(err36.length === 0);
	assert(val36.num === 5);
	assert(val36.str === 'hello');
	assert(val36.bool === true);

	const [err37, val37] = obj.validate({
		'num': 5,
		'str': 'hello',
		'bool': 'true'
	});
	assert(err37.length > 0);
	assert(val37 === undefined);

	const [err38, val38] = obj.validate({
		'num': 5,
		'str': 'hello'
	});
	assert(err38.length > 0);
	assert(val38 === undefined);

	const [err39, val39] = obj.validate({
		'num': 5,
		'str': 'hello',
		'bool': true,
		'extra': 'extra'
	});
	assert(err39.length === 0);
	assert(val39.num === 5);
	assert(val39.str === 'hello');
	assert(val39.bool === true);
	assert(val39.extra === 'extra');

	const obj2 = v.object({
		'num': v.number().optional(),
		'str': v.string().optional(),
		'bool': v.boolean().optional()
	});

	const [err40, val40] = obj2.validate(undefined);
	assert(err40.length > 0);
	assert(val40 === undefined);
})();

// equals
(() => {
	const eq = v.equal(5);
	const [err36, val36] = eq.validate(5);
	assert(err36.length === 0);
	assert(val36 === 5);

	const [err37, val37] = eq.validate(6);
	assert(err37.length > 0);
	assert(val37 === undefined);
})();

// or
(() => {
	const or = v.or(v.number().min(5), v.string().minlength(5));
	const [err38, val38] = or.validate(5);
	assert(err38.length === 0);
	assert(val38 === 5);

	const [err39, val39] = or.validate('hello');
	assert(err39.length === 0);
	assert(val39 === 'hello');

	const [err40, val40] = or.validate(4);
	assert(err40.length > 0);
	assert(val40 === undefined);

	const [err41, val41] = or.validate('hi');
	assert(err41.length > 0);
	assert(val41 === undefined);
})();

// datetime
(() => {
	const dt = v.datetime();

	const [err42, val42] = dt.validate('2020-01-01T00:00:00Z');
	assert(err42.length === 0);
	assert(val42.getTime() === new Date('2020-01-01T00:00:00Z').getTime());

	const [err43, val43] = dt.validate('2020-01-01T00:00:00');
	assert(err43.length === 0);
	assert(val43.getTime() === new Date('2020-01-01T00:00:00').getTime());

	const [err44, val44] = dt.validate(new Date('2020-01-01T00:00:00Z'));
	assert(err44.length === 0);
	assert(val44.getTime() === new Date('2020-01-01T00:00:00Z').getTime());

	const dt2 = v.datetime().optional();
	const [err45, val45] = dt2.validate(undefined);
	assert(err45.length === 0);
	assert(val45 === undefined);

	const dt3 = v.datetime().default('2020-01-01T00:00:00Z');
	const [err46, val46] = dt3.validate(undefined);
	assert(err46.length === 0);
	assert(val46.getTime() === new Date('2020-01-01T00:00:00Z').getTime());

	const dt4 = v.datetime().default();
	const [err47] = dt4.validate(undefined);
	assert(err47.length === 0);

	const dt5 = v.datetime().default(100);
	const [err48] = dt5.validate(undefined);
	assert(err48.length === 0);
})();

// instanceOf
(() => {
	class A { }
	const inst = v.instanceOf(A);

	const [err49, val49] = inst.validate(new A());
	assert(err49.length === 0);
	assert(val49 instanceof A);

	const [err50, val50] = inst.validate({});
	assert(err50.length > 0);
	assert(val50 === undefined);

	const inst2 = v.instanceOf(A).optional();

	const [err51, val51] = inst2.validate(undefined);
	assert(err51.length === 0);
	assert(val51 === undefined);

	const inst3 = v.instanceOf(A).default(new A());
	const [err52, val52] = inst3.validate(undefined);
	assert(err52.length === 0);
	assert(val52 instanceof A);
})();

console.log('If no asserts failed above, All tests passed!');
