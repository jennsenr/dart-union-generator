import Argument from "./argument"

export default class UnionCase {
  
  name: string
  factoryName: string
  args: Argument[]

  constructor(name: string, factoryName: string, args: Argument[]) {
    this.name = name
    this.factoryName = factoryName
    this.args = args
  }

  static fromMatchString(matchString: string): UnionCase | null {
    const caseNameRegex = /(?<=(=>?\s*))[_A-Z][a-zA-Z1-9]*(?=((\(\))?;))/
    const factoryNameRegex = /(?<=(factory\s(.*)\.)).*(?=(\(.*\)\s*=>?))/
    const argsRegex = /(?<=(\()).*(?=(\)\s*=>?))/

    const matchCaseName = matchString.match(caseNameRegex)
    const matchFactoryName = matchString.match(factoryNameRegex)
    const matchArgs = matchString.match(argsRegex)

    if (matchCaseName == null || matchFactoryName == null) {
      return null
    }

    const caseName = matchCaseName[0]
    const factoryName = matchFactoryName[0]
    const args = matchArgs != null && matchArgs[0].length > 0 ? matchArgs[0].split(',').map((e) => Argument.fromString(e)) : []

    return new UnionCase(caseName, factoryName, args)
  }
  
  toFactoryDartCode(className: string): string {
    const args = this.args.map((e) => e.toDartCode()).join(', ')

    const dartCode = `factory ${className}.${this.factoryName}(${args}) = ${this.name};`

    return dartCode;
  }

  toWhenArgDartCode(): string {
    const dartCode = `required void Function(${this.name}) ${this.factoryName},`

    return dartCode;
  }

  toWhenIsDartCode(): string {
    const dartCode = `
    if (this is ${this.name}) {
      ${this.factoryName}.call(this as ${this.name});
    }
`

    return dartCode;
  }

  toMapArgDartCode(): string {
    const dartCode = `required R Function(${this.name}) ${this.factoryName},`

    return dartCode;
  }

  toMapIsDartCode(): string {
    const dartCode = `
    if (this is ${this.name}) {
      return ${this.factoryName}.call(this as ${this.name});
    }
`
    return dartCode;
  }

  toClassDartCode(className: string): any {
    const notHasArgs = this.args.length < 1

    if (notHasArgs) {
      const dartCode = `class ${this.name} extends ${className} {}`

      return dartCode;
    }

    const properties = this.args.map((e) => e.toPropertyDartCode()).join('\n    ')
    const variables = this.args.map((e) => e.toThisVariableDartCode()).join(', ')
    const classConstructor = `${this.name}(${variables});`

    const dartCode = `
class ${this.name} extends ${className} {
    ${properties}

    ${classConstructor}
}`

    return dartCode;
  }
}