import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import yamlinc from 'yaml-include';
import { readFile } from '../read-file';

export function yamlToJson(content: string, filepath: string) {
  yamlinc.setBaseFile(filepath);
  return yaml.load(content, {
    schema: yamlinc.YAML_INCLUDE_SCHEMA,
    filename: yamlinc.basefile,
  });
}
export function loadYamlSync(filepath: string, cwd = process.cwd()) {
  filepath = path.resolve(cwd, filepath);
  const content = fs.readFileSync(filepath, 'utf8');
  return yamlToJson(content, filepath);
}

export async function loadYaml(filepath: string, cwd = process.cwd()) {
  filepath = path.resolve(cwd, filepath);
  const content = await readFile(filepath, 'utf8');
  return yamlToJson(content, filepath);
}
