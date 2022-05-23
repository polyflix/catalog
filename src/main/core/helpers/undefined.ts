const omitUndefined = (item: any) => JSON.parse(JSON.stringify(item));

export { omitUndefined };
