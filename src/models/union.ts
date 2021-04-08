import UnionCase from "./union_case";

export default class Union {
  name: string
  cases: UnionCase[]

  constructor(name: string, cases: UnionCase[]) {
    this.name = name;
    this.cases = cases;
  }

  private static findUnionCases(input: string): UnionCase[] {
    const unionCaseRegex = /factory\s(.*)=>?\s*(.*);/g
    let matches = input.match(unionCaseRegex)
  
    if (matches == null) {
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
    const classNameRegex = /(?<=(class\s))([A-Z][a-zA-Z0-9]*)/
  
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

  toFromStringDartCode(): string {
    const fromStringFactories = this.cases.filter((e) => e.args.length == 0).map((e) => e.toFromStringDartCode(this.name)).join('\n')
    const isDefault = `return ${this.name}.${this.cases[0].factoryName}();`
    const dartCode = `
   factory ${this.name}.fromString(String value) {
    ${fromStringFactories}

    ${isDefault}
   }
`

    return dartCode
  }

  toToStringDartCode(): string {
    const toStringCases = this.cases.map((e) => e.toToStringDartCode()).join('\n')
    const isDefault = `return '${this.cases[0].factoryName}';`
    const dartCode = `
    @override
   String toString() {
    ${toStringCases}

    ${isDefault}
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
  ${this.toFromStringDartCode()}
  ${this.toToStringDartCode()}
  }

${classes}
`

    return dartCode
  }
  
}
