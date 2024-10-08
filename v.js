const v = Object.freeze((() => {
	/**
	 * @returns {numberValidator}
	 */
	const number = () => {
		/**
		 * @typedef {object} numberValidator
		 * @property {(x: number) => numberValidator} default
		 * @property {(x: number) => numberValidator} min
		 * @property {(x: number) => numberValidator} max
		 * @property {() => numberValidator} isWhole
		 * @property {() => numberValidator} optional
		 * @property {(d: number) => [Error[], number | undefined]} validate
		 * @property {() => Error[]} errors
		 */
		return new class {
			constructor() {
				/** @type {Error[]} */
				this.err = [];
			}

			/**
			 * @param {number} x 
			 * @returns {numberValidator}
			 */
			default(x) {
				if (this._optional === true)
					this.err.push(new Error('number.default() cannot have a default value'));

				if (typeof x !== 'number' || isNaN(x))
					this.err.push(new Error('number.default() must be a number'));

				if (this.wholeNumber && !Number.isInteger(x))
					this.err.push(new Error('number.default() must be a whole number'));

				if (this._min !== undefined && x < this._min)
					this.err.push(new Error('number.default() must be greater than number.min()'));

				if (this._max !== undefined && x > this._max)
					this.err.push(new Error('number.default() must be less than number.max()'));

				this._default = x;
				return this;
			}

			/**
			 * @param {number} x 
			 * @returns {numberValidator}
			 */
			min(x) {
				if (typeof x !== 'number' || isNaN(x))
					this.err.push(new Error('number.min() must be a number'));

				if (this._max !== undefined && x > this._max)
					this.err.push(new Error('number.min() must be less than number.max()'));

				if (this.wholeNumber && !Number.isInteger(x))
					this.err.push(new Error('number.min() must be a whole number'));

				if (this._default !== undefined && x > this._default)
					this.err.push(new Error('number.min() must be less than number.default()'));

				this._min = x;
				return this;
			}

			/**
			 * @param {number} x 
			 * @returns {numberValidator}
			 */
			max(x) {
				if (typeof x !== 'number' || isNaN(x))
					this.err.push(new Error('number.max() must be a number'));

				if (this._min !== undefined && x < this._min)
					this.err.push(new Error('number.max() must be greater than number.min()'));

				if (this.wholeNumber && !Number.isInteger(x))
					this.err.push(new Error('number.max() must be a whole number'));

				if (this._default !== undefined && x < this._default)
					this.err.push(new Error('number.max() must be greater than number.default()'));

				this._max = x;
				return this;
			}

			/**
			 * @returns {numberValidator}
			 */
			isWhole() {
				if (this._default !== undefined && !Number.isInteger(this._default))
					this.err.push(new Error('number.isWhole() default value must be a whole number'));

				if (this._min !== undefined && !Number.isInteger(this._min))
					this.err.push(new Error('number.isWhole() min value must be a whole number'));

				if (this._max !== undefined && !Number.isInteger(this._max))
					this.err.push(new Error('number.isWhole() max value must be a whole number'));

				this.wholeNumber = true;
				return this;
			}

			/**
			 * @returns {numberValidator}
			 */
			optional() {
				if (this._default !== undefined)
					this.err.push(new Error('number.optional() cannot have a default value'));

				this._optional = true;
				return this;
			}

			/**
			 * @param {any} d
			 * @returns {[Error[], number | undefined]}
			 */
			validate(d) {
				if (this.err.length > 0) return [this.err, undefined];
				if (this._optional && (d === undefined || d === null)) return [[], d];
				if (this._default !== undefined && (d === undefined || d === null)) return [[], this._default];

				if (typeof d !== 'number' || isNaN(d))
					return [[new Error('number.validate() invalid number')], undefined];

				if (this._min !== undefined && d < this._min)
					return [[new Error('number.validate() number is less than minimum')], undefined];

				if (this._max !== undefined && d > this._max)
					return [[new Error('number.validate() number is greater than maximum')], undefined];

				if (this.wholeNumber && !Number.isInteger(d))
					return [[new Error('number.validate() number is not a whole number')], undefined];

				return [[], d];
			}

			/**
			 * @returns {Error[]}
			 */
			errors() { return this.err; }
		};
	}

	/**
	 * @returns {stringValidator}
	 */
	const string = () => {
		/**
		 * @typedef {object} stringValidator
		 * @property {(x: string) => stringValidator} default
		 * @property {(x: number) => stringValidator} minlength
		 * @property {(x: number) => stringValidator} maxlength
		 * @property {(x: number) => stringValidator} length
		 * @property {(x: string) => stringValidator} inCharset
		 * @property {() => stringValidator} optional
		 * @property {(d: string) => [Error[], string | undefined]} validate
		 * @property {() => Error[]} errors
		 */
		return new class {
			constructor() {
				/** @type {Error[]} */
				this.err = [];
			}

			/**
			 * @param {string} x 
			 * @returns {stringValidator}
			 */
			default(x) {
				if (this._optional === true)
					this.err.push(new Error('string.default() cannot have a default value'));

				if (typeof x !== 'string')
					this.err.push(new Error('string.default() must be a string'));

				if (this._minlength !== undefined && x.length < this._minlength)
					this.err.push(new Error('string.default() must be greater than string.minlength()'));

				if (this._maxlength !== undefined && x.length > this._maxlength)
					this.err.push(new Error('string.default() must be less than string.maxlength()'));

				if (this._length !== undefined && x.length !== this._length)
					this.err.push(new Error('string.default() must be equal to string.length()'));

				this._default = x;
				return this;
			}

			/**
			 * @param {number} x 
			 * @returns {stringValidator}
			 */
			minlength(x) {
				if (typeof x !== 'number' || isNaN(x))
					this.err.push(new Error('string.minlength() must be a number'));

				if (this._maxlength !== undefined && x > this._maxlength)
					this.err.push(new Error('string.minlength() must be less than string.maxlength()'));

				if (this._default !== undefined && x > this._default.length)
					this.err.push(new Error('string.minlength() must be less than string.default().length'));

				if (this._length !== undefined && x !== this._length)
					this.err.push(new Error('string.minlength() must be equal to string.length()'));

				this._minlength = x;
				return this;
			}

			/**
			 * @param {number} x 
			 * @returns {stringValidator}
			 */
			maxlength(x) {
				if (typeof x !== 'number' || isNaN(x))
					this.err.push(new Error('string.maxlength() must be a number'));

				if (this._minlength !== undefined && x < this._minlength)
					this.err.push(new Error('string.maxlength() must be greater than string.minlength()'));

				if (this._default !== undefined && x < this._default.length)
					this.err.push(new Error('string.maxlength() must be greater than string.default().length'));

				if (this._length !== undefined && x !== this._length)
					this.err.push(new Error('string.maxlength() must be equal to string.length()'));

				this._maxlength = x;
				return this;
			}

			/**
			 * @param {number} x 
			 * @returns {stringValidator}
			 */
			length(x) {
				if (typeof x !== 'number' || isNaN(x))
					this.err.push(new Error('string.length() must be a number'));

				if (this._default !== undefined && x !== this._default.length)
					this.err.push(new Error('string.length() must be equal to string.default().length'));

				if (this._minlength !== undefined && x < this._minlength)
					this.err.push(new Error('string.length() must be greater than string.minlength()'));

				if (this._maxlength !== undefined && x > this._maxlength)
					this.err.push(new Error('string.length() must be less than string.maxlength()'));

				this._length = x;
				return this;
			}

			/**
			 * @param {string} x 
			 * @returns {stringValidator}
			 */
			inCharset(x) {
				if (typeof x !== 'string' || x.length === 0)
					this.err.push(new Error('string.inCharset() must be a string with at least one character'));

				this._charset = x;
				return this;
			}

			/**
			 * @returns {stringValidator}
			 */
			optional() {
				if (this._default !== undefined)
					this.err.push(new Error('string.optional() cannot have a default value'));

				this._optional = true;
				return this;
			}

			/**
			 * @param {any} d 
			 * @returns {[Error[], string | undefined]}
			 */
			validate(d) {
				if (this.err.length > 0) return [this.err, undefined];
				if (this._optional && (d === undefined || d === null)) return [[], d];
				if (this._default !== undefined && (d === undefined || d === null)) return [[], this._default];

				if (typeof d !== 'string')
					return [[new Error('string.validate() invalid string')], undefined];

				if (this._minlength !== undefined && d.length < this._minlength)
					return [[new Error('string.validate() string is less than minimum length')], undefined];

				if (this._maxlength !== undefined && d.length > this._maxlength)
					return [[new Error('string.validate() string is greater than maximum length')], undefined];

				if (this._length !== undefined && d.length !== this._length)
					return [[new Error('string.validate() string is not the correct length')], undefined];

				if (this._charset !== undefined) {
					for (let i = 0; i < d.length; i++) {
						if (!this._charset.includes(d[i]))
							return [[new Error('string.validate() string contains invalid characters')], undefined];
					}
				}

				return [[], d];
			}

			/**
			 * @returns {Error[]}
			 */
			errors() { return this.err; }
		};
	}

	/**
	 * @returns {booleanValidator}
	 */
	const boolean = () => {
		/**
		 * @typedef {object} booleanValidator
		 * @property {(x: boolean) => booleanValidator} default
		 * @property {() => booleanValidator} optional
		 * @property {(d: boolean) => [Error[], boolean | undefined]} validate
		 * @property {() => Error[]} errors
		 */
		return new class {
			constructor() {
				/** @type {Error[]} */
				this.err = [];
			}

			/**
			 * @param {boolean} x 
			 * @returns {booleanValidator}
			 */
			default(x) {
				if (this._optional === true)
					this.err.push(new Error('boolean.default() cannot have a default value'));

				if (typeof x !== 'boolean')
					this.err.push(new Error('boolean.default() must be a boolean'));

				this._default = x;
				return this;
			}

			/**
			 * @returns {booleanValidator}
			 */
			optional() {
				if (this._default !== undefined)
					this.err.push(new Error('boolean.optional() cannot have a default value'));

				this._optional = true;
				return this;
			}

			/**
			 * @param {any} d 
			 * @returns {[Error[], boolean]}
			 */
			validate(d) {
				if (this.err.length > 0) return [this.err, undefined];
				if (this._optional && (d === undefined || d === null)) return [[], d];
				if (this._default !== undefined && (d === undefined || d === null)) return [[], this._default];

				if (typeof d !== 'boolean')
					return [[new Error('boolean.validate() invalid boolean')], undefined];

				return [[], d];
			}

			/**
			 * @returns {Error[]}
			 */
			errors() { return this.err; }
		}
	}

	/**
	 * @returns {datetimeValidator}
	 */
	const datetime = () => {
		/**
		 * @typedef {object} datetimeValidator
		 * @property {(x: Date | number | null | undefined) => datetimeValidator} default
		 * @property {() => datetimeValidator} optional
		 * @property {(d: any) => [Error[], Date | undefined]} validate
		 * @property {() => Error[]} errors
		 */
		return new class {
			constructor() {
				/** @type {Error[]} */
				this.err = [];
			}

			/**
			 * @param {Date | string | number | null | undefined} x (Date) Sets default to that datetime, (number) Sets default to current timestamp + number in ms, (null | undefined) Sets default to current datetime
			 * @returns {datetimeValidator}
			 */
			default(x) {
				if (this._optional === true)
					this.err.push(new Error('datetime.default() cannot have a default value'));

				if (typeof x === 'number' && isNaN(x))
					this.err.push(new Error('datetime.default() must be a number'));

				if (x instanceof Date)
					this._default = x;
				else if (typeof x === 'string')
					this._default = new Date(x);
				else if (typeof x === 'number')
					this._default = x;
				else if (x === null || x === undefined)
					this._default = 0;
				else this.err.push(new Error('datetime.default() must be a Date object, number, or null'));

				return this;
			}

			/**
			 * @returns {datetimeValidator}
			 */
			optional() {
				if (this._default !== undefined)
					this.err.push(new Error('datetime.optional() cannot have a default value'));

				this._optional = true;
				return this;
			}

			/**
			 * @param {any} d can be a Date object, number, or string
			 * @returns {[Error[], Date | undefined]}
			 */
			validate(d) {
				if (this.err.length > 0) return [this.err, undefined];
				if (this._optional && (d === undefined || d === null)) return [[], d];
				if (this._default !== undefined && (d === undefined || d === null)) {
					if (this._default instanceof Date)
						return [[], this._default];
					else if (typeof this._default === 'number')
						return [[], new Date(Date.now() + this._default)];
					else return [[new Error('datetime.validate() invalid default')], undefined];
				}

				if (d instanceof Date)
					return [[], d];
				else if (typeof d === 'number')
					return [[], new Date(d)];
				else if (typeof d === 'string') {
					const date = new Date(d);
					if (isNaN(date.getTime()))
						return [[new Error('datetime.validate() invalid date')], undefined];
					return [[], date];
				} else return [[new Error('datetime.validate() invalid date')], undefined];
			}

			/**
			 * @returns {Error[]}
			 */
			errors() { return this.err; }
		}
	}

	/**
	 * @template T
	 * @param {T} type The type of the array
	 * @returns {arrayValidator}
	 */
	const array = (type) => {
		/**
		 * @typedef {object} arrayValidator
		 * @property {(x: TT) => arrayValidator} default
		 * @property {(x: number) => arrayValidator} minlength
		 * @property {(x: number) => arrayValidator} maxlength
		 * @property {(x: number) => arrayValidator} length
		 * @property {() => arrayValidator} optional
		 * @property {(d: TT) => [Error[], TT | undefined]} validate
		 * @property {() => Error[]} errors
		 * @template TT
		*/
		return new class {
			constructor() {
				/** @type {Error[]} */
				this.err = [];

				if (typeof type !== 'object' || type === null || typeof type.validate !== 'function')
					this.err.push(new Error('array() type is invalid'));
			}

			/**
			 * @param {TT} x 
			 * @returns {arrayValidator}
			 */
			default(x) {
				if (this._optional === true)
					this.err.push(new Error('array.default() cannot have a default value'));

				if (!Array.isArray(x))
					this.err.push(new Error('array.default() must be an array'));

				if (this._minlength !== undefined && x.length < this._minlength)
					this.err.push(new Error('array.default() must be greater than array.minlength()'));

				if (this._maxlength !== undefined && x.length > this._maxlength)
					this.err.push(new Error('array.default() must be less than array.maxlength()'));

				if (this._length !== undefined && x.length !== this._length)
					this.err.push(new Error('array.default() must be equal to array.length()'));

				if (typeof type.validate === 'function') {
					for (let i = 0; i < x.length; i++) {
						const [err, val] = type.validate(x[i]);
						if (err.length > 0) {
							this.err.push(new Error(`array.default() element ${i} is invalid`));
							break;
						}
					}
				} else this.err.push(new Error('array.default() type is invalid'));

				this._default = x;
				return this;
			}

			/**
			 * @param {number} x 
			 * @returns {arrayValidator}
			 */
			minlength(x) {
				if (typeof x !== 'number' || isNaN(x))
					this.err.push(new Error('array.minlength() must be a number'));

				if (this._maxlength !== undefined && x > this._maxlength)
					this.err.push(new Error('array.minlength() must be less than array.maxlength()'));

				if (this._default !== undefined && x > this._default.length)
					this.err.push(new Error('array.minlength() must be less than array.default().length'));

				if (this._length !== undefined && x !== this._length)
					this.err.push(new Error('array.minlength() must be equal to array.length()'));

				this._minlength = x;
				return this;
			}

			/**
			 * @param {number} x 
			 * @returns {arrayValidator}
			 */
			maxlength(x) {
				if (typeof x !== 'number' || isNaN(x))
					this.err.push(new Error('array.maxlength() must be a number'));

				if (this._minlength !== undefined && x < this._minlength)
					this.err.push(new Error('array.maxlength() must be greater than array.minlength()'));

				if (this._default !== undefined && x < this._default.length)
					this.err.push(new Error('array.maxlength() must be greater than array.default().length'));

				if (this._length !== undefined && x !== this._length)
					this.err.push(new Error('array.maxlength() must be equal to array.length()'));

				this._maxlength = x;
				return this;
			}

			/**
			 * @param {number} x 
			 * @returns {arrayValidator}
			 */
			length(x) {
				if (typeof x !== 'number' || isNaN(x))
					this.err.push(new Error('array.length() must be a number'));

				if (this._default !== undefined && x !== this._default.length)
					this.err.push(new Error('array.length() must be equal to array.default().length'));

				if (this._minlength !== undefined && x < this._minlength)
					this.err.push(new Error('array.length() must be greater than array.minlength()'));

				if (this._maxlength !== undefined && x > this._maxlength)
					this.err.push(new Error('array.length() must be less than array.maxlength()'));

				this._length = x;
				return this;
			}

			/**
			 * @returns {arrayValidator}
			 */
			optional() {
				if (this._default !== undefined)
					this.err.push(new Error('array.optional() cannot have a default value'));

				this._optional = true;
				return this;
			}

			/**
			 * @param {TT} d 
			 * @returns {[Error[], TT | undefined]}
			 */
			validate(d) {
				if (this.err.length > 0) return [this.err, undefined];
				if (this._optional && (d === undefined || d === null)) return [[], d];
				if (this._default !== undefined && (d === undefined || d === null)) return [[], this._default];

				if (!Array.isArray(d))
					return [[new Error('array.validate() invalid array')], undefined];

				if (this._minlength !== undefined && d.length < this._minlength)
					return [[new Error('array.validate() array is less than minimum length')], undefined];

				if (this._maxlength !== undefined && d.length > this._maxlength)
					return [[new Error('array.validate() array is greater than maximum length')], undefined];

				if (this._length !== undefined && d.length !== this._length)
					return [[new Error('array.validate() array is not the correct length')], undefined];

				if (typeof type.validate === 'function') {
					for (let i = 0; i < d.length; i++) {
						const [err, val] = type.validate(d[i]);
						if (err.length > 0)
							return [[new Error(`array.validate() element ${i} is invalid`), undefined]];

						d[i] = val;
					}
				} else return [[new Error('array.validate() type is invalid'), undefined]];

				return [[], d];
			}

			/**
			 * @returns {Error[]}
			 */
			errors() {
				let ret = this.err;
				if (typeof type.errors !== 'function' || typeof type.validate !== 'function')
					ret.push(new Error('array.errors() type is invalid'));
				else ret = ret.concat(type.errors());

				return ret;
			}
		}
	}

	/**
		 * @param {object} types 
		 * @returns {objectValidator}
		 */
	const object = (types) => {
		/**
		 * @typedef {object} objectValidator
		 * @property {() => objectValidator} optional
		 * @property {(d: object) => [Error[], object | undefined]} validate
		 * @property {() => Error[]} errors
		 */
		return new class {
			constructor() {
				/** @type {Error[]} */
				this.err = [];

				if (types === undefined || types === null) return [[new Error('object.validate() invalid object')], undefined];

				for (const key in types) {
					if (types[key].validate && typeof types[key].validate !== 'function')
						this.err.push(new Error(`object() key ${key} is invalid`));
				}
			}

			/**
			 * @returns {objectValidator}
			 */
			optional() {
				this._optional = true;
				return this;
			}

			/**
			 * @param {object} d 
			 * @returns {[Error[], any]}
			 */
			validate(d) {
				if (this.err.length > 0) return [this.err, undefined];
				if (this._optional && (d === undefined || d === null)) return [[], d];
				if (this._default !== undefined && (d === undefined || d === null)) return [[], this._default];

				if (d === null || d === undefined || typeof d !== 'object')
					return [[new Error('object.validate() invalid object')], undefined];

				for (const key in types) {
					if (types[key].validate && typeof types[key].validate !== 'function')
						return [[new Error(`object.validate() key ${key} is invalid`), undefined]];

					const [err, val] = types[key].validate(d[key]);
					if (err.length > 0)
						return [[new Error(`object.validate() key ${key} is invalid`), undefined]];

					d[key] = val;
				}

				return [[], d];
			}

			/**
			 * @returns {Error[]}
			 */
			errors() {
				let ret = this.err;
				for (const key in types) {
					if (typeof types[key].validate !== 'function' || typeof types[key].errors !== 'function')
						ret.push(new Error(`object.errors() key ${key} is invalid`));
					else ret = ret.concat(types[key].errors());
				}

				return ret;
			}
		}
	}

	/**
	 * @param {Function} type
	 * @returns {instanceofValidator}
	 */
	const instanceOf = (type) => {
		/**
		 * @typedef {object} instanceofValidator
		 * @property {() => instanceofValidator} optional
		 * @property {(x: any) => instanceofValidator} default
		 * @property {(d: any) => [Error[], any | undefined]} validate
		 * @property {() => Error[]} errors
		 */
		return new class {
			constructor() {
				this.err = [];
				if (typeof type !== 'function')
					this.err.push(new Error('instanceof() type must be a class'));
			}

			optional() {
				this._optional = true;
				return this;
			}

			default(x) {
				if (this._optional === true)
					this.err.push(new Error('instanceof.default() cannot have a default value'));

				if (!(x instanceof type))
					this.err.push(new Error('instanceof.default() must be an instance of the class'));

				this._default = x;
				return this;
			}

			validate(d) {
				if (this.err.length > 0) return [this.err, undefined];
				if (this._optional && (d === undefined || d === null)) return [[], d];
				if (this._default !== undefined && (d === undefined || d === null)) return [[], this._default];

				if (!(d instanceof type))
					return [[new Error('instanceof.validate() invalid instance')], undefined];

				return [[], d];
			}

			errors() { return this.err; }
		}
	}

	/**
		 * @param {any} x 
		 * @returns {equalValidator} 
		 */
	const equal = (x) => {
		/**
		 * @typedef {object} equalValidator
		 * @property {(d: any) => [Error[], any | undefined]} validate
		 * @property {() => Error[]} errors
		 */
		return new class {
			validate(d) {
				if (d !== x)
					return [[new Error('equal.validate() values are not equal')], undefined];
				return [[], d];
			}

			errors() { return []; }
		}
	}

	/**
	 * @param {any} types 
	 * @returns {orValidator}
	 */
	const or = (...types) => {
		/**
		 * @typedef {object} orValidator
		 * @property {(x: any) => orValidator} default
		 * @property {() => orValidator} optional
		 * @property {(d: any) => [Error[], any | undefined]} validate
		 * @property {() => Error[]} errors
		 */
		return new class {
			constructor() {
				/** @type {Error[]} */
				this.err = [];

				if (types.length === 0)
					this.err.push(new Error('or() must be given at least one type'));

				for (let i = 0; i < types.length; i++) {
					if (typeof types[i].validate !== 'function')
						this.err.push(new Error('or() all types must have a validate function'));
				}
			}

			/**
			 * @param {any} x 
			 * @returns {orValidator}
			 */
			default(x) {
				if (this._optional === true) {
					this.err.push(new Error('or.default() cannot have a default value'));
					return this;
				}

				for (let i = 0; i < types.length; i++) {
					const [err, val] = types[i].validate(x);
					if (err.length === 0) {
						this._default = val;
						return this;
					}
				}

				return this;
			}

			/**
			 * @returns {orValidator}
			 */
			optional() {
				if (this._default !== undefined) {
					this.err.push(new Error('or.optional() cannot have a default value'));
					return this;
				}

				return this;
			}

			/**
			 * @param {any} d 
			 * @returns {[Error[], any | undefined]}
			 */
			validate(d) {
				if (this.err.length > 0) return [this.err, undefined];
				if (this._optional && (d === undefined || d === null)) return [[], d];
				if (this._default !== undefined && (d === undefined || d === null)) return [[], this._default];

				for (let i = 0; i < types.length; i++) {
					const [err, val] = types[i].validate(d);
					if (err.length === 0)
						return [[], val];
				}

				return [[new Error('or.validate() no types matched')], undefined];
			}

			/**
			 * @returns {Error[]}
			 */
			errors() { return this.err; }
		}
	}

	return {
		number,
		string,
		boolean,
		datetime,
		array,
		object,
		instanceOf,

		equal,
		or
	}
})());

if (typeof module !== 'undefined') module.exports = v;
