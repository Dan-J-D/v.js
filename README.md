# Tiny vanilla js type validator
A simple, small & secure js type validator. Easily readable & extendable code. Single file include. Returns errors or values.

## Examples 
### Typescript Type into V.js
```ts
interface type_1 {
    name: string;
    age?: number;
    type: 'person' | 'place';
    friends_names?: string[];
}
```
to
```js
const type_1 = v.object({
    'name': v.string(),
    'age': v.number().optional(),
    'type': v.or(v.equal('person'), v.equal('place')),
    'friends_names': v.array(v.string()).optional()
});
```
BUT, you can do specific validation functions like this.
```js
const type_id = v.string().length(16).inCharset('0123456789abcdef');
```

###  Errors as values
```js
const [errs, val] = type_1.validate({
    name: 'dan',
    age: 18,
    type: 'person',
    friends_names: [
        'spencer'
    ]
});
if (errs.length > 0) {
    console.error(errs[0]);
    return;
}

// val.* is valid
```

## How to add a custom type
You just need to implement a `validate()` & `errors()` functions.
```js
const customType = () => {
    return new class {
        /**
          * @param {any} d
          * @returns {[Error[], any | undefined]}
          */
        validate(d) {}
        
        /**
          * @returns {Error[]}
          */
        errors() {}
    }
}
```
