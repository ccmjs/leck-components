# Aggregator

The aggregator component collects information from other *ccm* components.

## Usage

### Component preparation

You first have to specify information that can be aggregated on a *ccm* component. This can be done inside the configuration.

```json
{
  "aggregatable": [ "topics", "vocabulary" ],
  "topics": [ "math", "arithmetic" ],
  "vocabulary": [ "addition", "subtraction", "multiplication ", "division" ]
}
```

The key `aggregatable` specifies, inside an array of strings, all keys that should be aggregated from this configuration. Aggregatable fields have to be of type `Array<string>`.


### Aggregating information

To use the component create an instance of it inside a *ccm* component and specify configuration files as source for the information.

```json
{
  "aggregator": [ "ccm.instance", "ccm.aggregator.js",
    {
      "source": [
        [ "ccm.get", "configs.js", "quiz" ],
        [ "ccm.get", "configs.js", "cloze" ],
        [ "ccm.get", "configs.js", "slidecast" ]
      ]
    }
  ]
}
```

You can now call `aggregate` on the instance to collect the information.

```javascript
const aggregatedInformation = self.aggregator.aggregate();
console.log('Aggregated:', aggregatedInformation);
```

### Configuration

The aggregator can be configured either when creating the instance or when calling the `aggregate` function.

| Key             | Type            | Default   | Description                                                  |
| --------------- | --------------- | --------- | ------------------------------------------------------------ |
| log             | `Boolean`       | false     | In addition to returning the aggregated information, the function will also log it to the console. |
| allowDuplicates | `Boolean`       | false     | Duplicate values will appear as often and in the order they are found. |
| aggregatable    | `Array<string>` | undefined | Overrides the aggregatable array inside of configurations. |

Example:

```javascript
self.aggregator.aggregate({
  log: true,
  allowDuplicates: true,
  aggregatable: ["topics", "vocabulary"]
});
```

## Demo

A demo is provided [here](https://ccmjs.github.io/leck-components/aggregator/demo/). This demo shows, how the aggregator component can be used inside of another component.
