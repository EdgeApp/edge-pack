# Edge Pack

A CLI tool for bundling currency plugins to React Native projects.

## Usage
An entry file is required to tell webpack what currency plugins to bundle. You can also perform custom configurations in this entry file for certain plugin.

```js
// ./pluginEntry.js

import 'edge-currency-accountbased/lib/index.js'
import { setMemletConfig } from './node_modules/edge-currency-plugins'

setMemletConfig({
  maxMemoryUsage: 50 * 1024 * 1024 // 50MB
})
```

The CLI tool takes an argument representing the relative path to `pluginEntry.js`:
```
yarn pack <PATH_TO_ENTRY_FILE>
```


For example, if your entry file is located under the `src` folder, you'd run:
```
yarn pack src/pluginEntry.js
```
