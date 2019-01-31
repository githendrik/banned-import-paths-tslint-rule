# banned-import-paths-tslint-rule

Disallow certain paths in your typescript import statements

## Installation

`npm i --save-dev banned-import-paths-tslint-rule`


## Usage

Add this rule package to your rules directory list, then configure it to your liking.

```
{
  "rulesDirectory": [
    "banned-import-paths-tslint-rule"
  ],
  "rules": {
	...
   "banned-import-paths": 
   		[true,
		    ["bad/path", "No imports from here!", ".spec.ts|.e2e.ts"],
		    ["ugly/path", "This path is ugly"]
		]
  }
}
```

Each configuration entry is parsed as follows:

1. The path (or part of the path) that should be banned
2. The reason behind banning this path for imports (optional)
3. A pipe-separated list of file names that should be exempt from this rule. Useful for test code etc. (optional)