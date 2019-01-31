import { AbstractWalker } from "tslint";

import { foo } from "./my/banned/path/file";

console.log(foo.bar);
