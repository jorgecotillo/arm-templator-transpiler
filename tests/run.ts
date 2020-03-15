import 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { ArmLangCompiler } from '../src/compiler';
import { TemplateWriter } from '../src/visitors/common';

function expectEqualIgnoringLineEndings(actual: string, expected: string) {
  actual = actual.replace(/\r/g, '');
  expected = expected.replace(/\r/g, '');

  expect(actual).to.equal(expected);
}

class TemplateStringWriter implements TemplateWriter {
  private templateJson: string = '';

  write(template: any): void {
    this.templateJson = JSON.stringify(template, null, 2);
  }

  read() {
    return this.templateJson;
  }
}

function testTemplateGeneration(input: string, output: string) {
  input = path.resolve(__dirname, input);
  output = path.resolve(__dirname, output);

  const outputData = fs.readFileSync(output, { encoding: 'utf8' });

  const compiler = new ArmLangCompiler();
  const writer = new TemplateStringWriter();
  compiler.transpile(input, writer);

  //fs.writeFileSync(output, writer.read(), {encoding:'utf8'});

  expectEqualIgnoringLineEndings(writer.read(), outputData);
}

describe('Template generation', () => {
  it('basic', () => testTemplateGeneration('./basic.arm', './basic.json'));
  it('module', () => testTemplateGeneration('./module.arm', './module.json'));
});