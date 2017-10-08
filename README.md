# JS Change Tracker

Tracks changes to a JS object, allowing to undo and redo.

## Usage

```javascript
const tracker = new ChangeTracker();

tracker.add('test', 'lorem');
tracker.add('test', 'ipsum');

tracker.undo();
tracker.redo();
```

Nested properties can be added:
```javascript
tracker.add('nested.property', 'value');
```

Which will result in:
```javascript
{
    nested: {
        property: 'value'
    }
}
```

Changes to array elements can also be tracked:
```javascript
const tracker = new ChangeTracker({
    test: [ 'one', 'two', 'three' ]
});

tracker.add('test.1', 'ipsum');
```

To retrieve the final version of tracked object after all modifications, undoing and redoing:
```javascript
tracker.getFinal();
```

## Stacking

A property can be marked to stack changes, instead of adding a new one each time `.add()` is called. That can be useful whe tracking changes to text inputs, so that undo doesn't undo changes letter by letter.

```javascript
tracker.stack('test');

tracker.add('test', 'a');
tracker.add('test', 'ab');
tracker.add('test', 'abc');

tracker.undo(); // Removes all changes to 'test'
```