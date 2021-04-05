import { toLowerFirstCase } from "../utils/string_extension"


export default class Argument {
  name: string
  type: string

  constructor(name: string, type: string) {
    this.name = name
    this.type = type
  }

  static fromString(input: string) {
    const splitted = input.trim().split(' ')
    const type = splitted[0]
    const name = toLowerFirstCase(splitted[1])

    return new Argument(name, type)
  }

  toDartCode() {
    const dartCode = `${this.type} ${this.name}`
    
    return dartCode
  }

  toPropertyDartCode() {
    const dartCode = `final ${this.type} ${this.name};`
    
    return dartCode
  }

  toVariableDartCode() {
    const dartCode = `${this.name}`
    
    return dartCode
  }

  toThisVariableDartCode() {
    const dartCode = `this.${this.name}`
    
    return dartCode
  }
}

