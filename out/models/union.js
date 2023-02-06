"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const union_case_1 = require("./union_case");
class Union {
    constructor(name, cases) {
        this.name = name;
        this.cases = cases;
    }
    static findUnionCases(input) {
        const unionCaseRegex = /factory\s(.*)=>?\s*(.*);/g;
        let matches = input.match(unionCaseRegex);
        if (matches == null) {
            return [];
        }
        let unionCases = [];
        for (const match of matches) {
            const unionCase = union_case_1.default.fromMatchString(match);
            if (unionCase == null) {
                continue;
            }
            unionCases.push(unionCase);
        }
        return unionCases;
    }
    static fromString(input) {
        const classNameRegex = /(?<=(class\s))([A-Z][a-zA-Z0-9]*)/;
        const match = input.match(classNameRegex);
        if (match == null) {
            return null;
        }
        const className = match[0];
        const cases = this.findUnionCases(input);
        return new Union(className, cases);
    }
    toWhenDartCode() {
        const whenArgs = this.cases.map((e) => e.toWhenArgDartCode()).join('\n    ');
        const whenIs = this.cases.map((e) => e.toWhenIsDartCode()).join('\n\n    ');
        const dartCode = `
  void when({
    ${whenArgs}
  }) {
    ${whenIs}
  }
`;
        return dartCode;
    }
    toMaybeWhenDartCode() {
        const maybeWhenArgs = this.cases.map((e) => e.toMaybeWhenArgDartCode()).join('\n    ');
        const whenIs = this.cases.map((e) => e.toMaybeWhenIsDartCode()).join('\n');
        const orElseArg = `required void Function() orElse,`;
        const orElse = `orElse.call();`;
        const dartCode = `
  void maybeWhen({
    ${maybeWhenArgs}
    ${orElseArg}
  }) {
${whenIs}
    ${orElse}
  }
`;
        return dartCode;
    }
    toMaybeMapDartCode() {
        const maybeMapArgs = this.cases.map((e) => e.toMaybeMapArgDartCode()).join('\n    ');
        const mapIs = this.cases.map((e) => e.toMaybeMapIsDartCode()).join('\n');
        const orElseArg = `required R Function() orElse,`;
        const orElse = `return orElse.call();`;
        const dartCode = `
  R maybeMap<R>({
    ${maybeMapArgs}
    ${orElseArg}
  }) {
${mapIs}
    ${orElse}
  }
`;
        return dartCode;
    }
    toMapDartCode() {
        const mapArgs = this.cases.map((e) => e.toMapArgDartCode()).join('\n    ');
        const mapIs = this.cases.map((e) => e.toMapIsDartCode()).join('\n');
        const isDefault = `${this.cases[0].factoryName}.call(this as ${this.cases[0].name});`;
        const dartCode = `
  R map<R>({
    ${mapArgs}
  }) {
${mapIs}
    return ${isDefault}
  }
`;
        return dartCode;
    }
    toFromStringDartCode() {
        const fromStringFactories = this.cases.filter((e) => e.args.length == 0).map((e) => e.toFromStringDartCode(this.name)).join('\n');
        const isDefault = `return ${this.name}.${this.cases[0].factoryName}();`;
        const dartCode = `
   factory ${this.name}.fromString(String value) {
    ${fromStringFactories}

    ${isDefault}
   }
`;
        return dartCode;
    }
    toToStringDartCode() {
        const toStringCases = this.cases.map((e) => e.toToStringDartCode()).join('\n');
        const isDefault = `return '${this.cases[0].factoryName}';`;
        const dartCode = `
    @override
   String toString() {
    ${toStringCases}

    ${isDefault}
   }
`;
        return dartCode;
    }
    toDartCode() {
        const factories = this.cases.map((e) => e.toFactoryDartCode(this.name)).join('\n  ');
        const classes = this.cases.map((e) => e.toClassDartCode(this.name)).join('\n');
        const dartCode = `
abstract class ${this.name} {
  const ${this.name}();
  ${factories}
  ${this.toWhenDartCode()}
  ${this.toMapDartCode()}
  ${this.toMaybeWhenDartCode()}
  ${this.toMaybeMapDartCode()}
  ${this.toFromStringDartCode()}
  ${this.toToStringDartCode()}
  }

${classes}
`;
        return dartCode;
    }
}
exports.default = Union;
//# sourceMappingURL=union.js.map