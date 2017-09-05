React higher order components for the [deepstream.io](https://deepstreamhub.com/open-source/?io) server.

## Usage

### withRecord

Provides the deepstream record to the component.

Properties passed to the wrapped component:

* `record` an object containing the record's properties
* `onChange` a callback that can be called when the record has changed

```js
import React from 'react';
import { withRecord } from 'deepstream.io-react-hoc';

const Component = (props) => (
    <div>
        {JSON.serialize(props.record)}
    </div>
    );

const ConnectedComponent = withRecord(Component, 'record-name');

//use it:
(
    <ConnectedComponent ds={dsClient} />
)

```

### withList

Provides the deepstream list entries to the component.

Properties passed to the wrapped component:

* `entries` an array with the entries held by that list
* `addEntry` a callback that can be called to add an entry to the list

```js
import React from 'react';
import { withList } from 'deepstream.io-react-hoc';

const Component = (props) => (
    <div>
        {props.entries.map(entry => (<div>{entry}</div>)}
    </div>
    );

const ConnectedComponent = withList(Component, 'list-name');

//use it:
(
    <ConnectedComponent ds={dsClient} />
)

```

### withRPC

Calls the deepstream RPC method.

Properties passed to the wrapped component:

* `rpcResult` the result returned by the deepstream server

```js
import React from 'react';
import { withRPC } from 'deepstream.io-react-hoc';

const Component = (props) => (
    <div>
        {JSON.stringify(props.rpcResult)}
    </div>
    );

const ConnectedComponent = withRPC(Component, 'rpcName', rpcOptionalArgs);

//use it:
(
    <ConnectedComponent ds={dsClient} />
)

```

