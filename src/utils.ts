import { HassEntity } from 'home-assistant-js-websocket';
import { compress as lzStringCompress, decompress as lzStringDecompress } from 'lz-string';
import { ChartCardConfig } from './types';

export function compress(data: unknown): string {
  return lzStringCompress(JSON.stringify(data));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decompress(data: unknown | undefined): any | undefined {
  if (data !== undefined && typeof data === 'string') {
    const dec = lzStringDecompress(data);
    return dec && JSON.parse(dec);
  }
  return data;
}

export function getMilli(hours: number): number {
  return hours * 60 ** 2 * 10 ** 3;
}

export function log(message: unknown): void {
  // eslint-disable-next-line no-console
  console.warn('apexcharts-card: ', message);
}

/**
 * Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays.
 *
 * @author inspired by [jhildenbiddle](https://stackoverflow.com/a/48218209).
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function mergeDeep(target: any, source: any): any {
  const isObject = (obj) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
}

export function computeName(
  index: number,
  config: ChartCardConfig | undefined,
  entities: HassEntity[] | undefined[] | undefined = undefined,
  entity: HassEntity | undefined = undefined,
): string {
  if (entity) {
    return config?.series[index].name || entity?.attributes?.friendly_name || entity.entity_id || '';
  } else {
    return (
      config?.series[index].name || entities?.[index]?.attributes?.friendly_name || entities?.[index]?.entity_id || ''
    );
  }
}

export function computeUom(
  index: number,
  config: ChartCardConfig | undefined,
  entities: HassEntity[] | undefined[] | undefined = undefined,
  entity: HassEntity | undefined = undefined,
): string {
  if (entity) {
    return config?.series[index].unit || entity.attributes?.unit_of_measurement || '';
  } else {
    return config?.series[index].unit || entities?.[index]?.attributes?.unit_of_measurement || '';
  }
}