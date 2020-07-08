import yaml from 'js-yaml';
import loadConfig, { IConfigOptions } from 'load-config-folder';
import yamlinc from 'yaml-include';

// loadConfig.addConfig(['.web-clipper-srv', 'web-clipper-srv']);
loadConfig.register('.json', JSON.parse as any);

function yamlParse(
  content: string,
  aOptions: IConfigOptions,
  aCfgPath: string
): any {
  yamlinc.setBaseFile(aCfgPath);
  return yaml.load(
    content,
    Object.assign(
      { schema: yamlinc.YAML_INCLUDE_SCHEMA, filename: yamlinc.basefile },
      aOptions
    ) as any
  );
}

loadConfig.register(['.yaml', '.yml'], yamlParse);

export default loadConfig;
