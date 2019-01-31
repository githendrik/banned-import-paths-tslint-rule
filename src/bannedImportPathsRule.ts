import { dedent } from 'tslint/lib/utils';
import { ImportDeclaration, SourceFile } from "typescript";
import { IRuleMetadata, RuleFailure, RuleWalker, Rules, IOptions } from "tslint/lib";

export class Rule extends Rules.AbstractRule {
    static readonly metadata: IRuleMetadata = {
        ruleName: "banned-import-paths",
        type: "maintainability",
        description: `Disallows imports from specific paths`,
        options: {
            type: "list",
            listType: {
                type: "array",
                items: {type: "string"},
                minLength: 1,
                maxLength: 3
            }
        },
        optionsDescription: dedent`
            A list of \`["path", "reason", "exemptions"]\`, which bans
            imports from \`path\``,
        optionExamples: [[true, ["/some/bad/path", "No imports from there!", ".spec.ts"]]],
        rationale: `Importing from certain paths may be unwanted`,
        typescriptOnly: false
    };

    apply(sourceFile: SourceFile): RuleFailure[] {
        return this.applyWithWalker(
            new BannedImportPathsWalker(sourceFile, this.getOptions())
        );
    }
}

class BannedImportPathsWalker extends RuleWalker {
    constructor(sourceFile: SourceFile, options: IOptions) {
        super(sourceFile, options);
    }

    public visitImportDeclaration(node: ImportDeclaration) {
        const options = this.getOptions();
        const parentFile = node.parent as SourceFile;
        const importPath: string = node.moduleSpecifier.getFullText().trim();

        options.forEach(
            ([bannedPath, reasonMessage, exemptions]: [string, string, string]) => {
                if (importPath.indexOf(bannedPath) > -1) {
                    const errorStartPos = node.getText().indexOf(bannedPath);
                    const errorEndPos = errorStartPos + bannedPath.length;

                    if (!isExcluded(parentFile.fileName, exemptions)) {
                        this.addFailureAt(errorStartPos, errorEndPos - errorStartPos, getFailureMessage(bannedPath, reasonMessage));
                    }
                }
            }
        );

        // call the base version of this visitor to actually parse this node
        super.visitImportDeclaration(node);
    }
}

function getFailureMessage(bannedImport: string, reasonMessage: string): string {
    return `imports from ${bannedImport} are not allowed. Reason: ${reasonMessage ? reasonMessage : 'no specific reason given'}`
}

function isExcluded(fileName: string, exemptions: string = '') {
    return exemptions.length > 0 && exemptions.split('|').filter(e => fileName.indexOf(e) > -1).length > 0;
}
