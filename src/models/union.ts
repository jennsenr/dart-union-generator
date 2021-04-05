import { toLowerFirstCase } from "../utils/string_extension";
import UnionCase from "./union_case";

export default class Union {
  name: string
  cases: UnionCase[]

  constructor(name: string, cases: UnionCase[]) {
    this.name = name;
    this.cases = cases;
  }

  private static findUnionCases(input: string): UnionCase[] {
    const unionCaseRegex = /factory\s(.*)=>\s*(.*);/g
    let matches = input.match(unionCaseRegex)
  
    if (matches == null || matches.length < 1) {
      return []
    }
  
    let unionCases: UnionCase[] = []
  
    for (const match of matches) {
      const unionCase = UnionCase.fromMatchString(match)
  
      if (unionCase == null) {
        continue
      }
  
      unionCases.push(unionCase)
    }
  
    return unionCases
  }
  
   static fromString(input: string) : Union | null {
    const classNameRegex = /(?<=(class\s)).*(?=(\s\{))/
  
    const match = input.match(classNameRegex)
  
    if (match == null) {
      return null
    }
  
    const className = match[0]
  
    const cases = this.findUnionCases(input)
  
    return new Union(className, cases)
  }

  toWhenDartCode(): string {
    const whenArgs = this.cases.map((e) => e.toWhenArgDartCode()).join('\n    ')
    const whenIs = this.cases.map((e) => e.toWhenIsDartCode()).join('\n')
    const isDefault = `${this.cases[0].factoryName}.call(this as ${this.cases[0].name});`
    const dartCode = `
  void when({
    ${whenArgs}
  }) {
${whenIs}
    ${isDefault}
  }
`

    return dartCode
  }

  toMapDartCode(): string {
    const mapArgs = this.cases.map((e) => e.toMapArgDartCode()).join('\n    ')
    const mapIs = this.cases.map((e) => e.toMapIsDartCode()).join('\n')
    const isDefault = `${this.cases[0].factoryName}.call(this as ${this.cases[0].name});`
    const dartCode = `
  R map<R>({
    ${mapArgs}
  }) {
${mapIs}
    return ${isDefault}
  }
`

    return dartCode
  }
  


  toDartCode(): string {
    const factories = this.cases.map((e) => e.toFactoryDartCode(this.name)).join('\n  ')
    const classes = this.cases.map((e) => e.toClassDartCode(this.name)).join('\n')

    const dartCode = 
`
abstract class ${this.name} {
  const ${this.name}();
  ${factories}
  ${this.toWhenDartCode()}
  ${this.toMapDartCode()}
  }

${classes}
`

    return dartCode
  }
  
}
