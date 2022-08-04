// schema-functions.js

function SchemaFunctions(schema) {
  const object = schema;
  this.length = () => {
    return Object.keys(object).length;
  };
}

function schemaFunctions(object) {
  var schemas;

  let i = 0;
  while (i < Object.keys(object).length) {
    const obj = {
      key: Object.keys(object)[i],
      value: Object.values(object)[i],
    };
    const mySchemaFunctions = new SchemaFunctions(object[obj.key]);
    schemas = {
      ...schemas,
      ...{
        ...object,
        ...{ [`${obj.key}Functions`]: mySchemaFunctions },
      },
    };

    i++;
  }

  return schemas;
}

// console.log(schemaFunctions({ admin: [{ char: "a" }, { char: "b" }] }));

module.exports = { schemaFunctions };
