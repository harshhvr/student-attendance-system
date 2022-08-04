// index.js

run();

function run() {
  try {
    // charactersInBlocks({ target: ".cb-text" });

    // Show Requird Inputs
    showRequiredInputsByQuerySelector("input[name='user_id']+label");
    showRequiredInputsByQuerySelector("input[name='user_password']+label");
    showRequiredInputsByQuerySelector("select[name='user_type']+label");

    showRequiredInputsByQuerySelector("input[name='aid']+label");
    showRequiredInputsByQuerySelector("input[name='tid']+label");
    showRequiredInputsByQuerySelector("input[name='sid']+label");
    showRequiredInputsByQuerySelector("input[name='fname']+label");
    showRequiredInputsByQuerySelector("input[name='lname']+label");
    showRequiredInputsByQuerySelector("input[name='email']+label");
    showRequiredInputsByQuerySelector("input[name='password']+label");
    showRequiredInputsByQuerySelector("select[name='tid']+label");
    showRequiredInputsByQuerySelector("select[name='programme']+label");
    showRequiredInputsByQuerySelector("select[name='class']+label");
    showRequiredInputsByQuerySelector("select[name='department']+label");
    showRequiredInputsByQuerySelector("select[name='section']+label");
    showRequiredInputsByQuerySelector("select[name='subject_code']+label");
    // showRequiredInputsByQuerySelector("select>option[selected]");

    // console.clear();
  } catch (err) {
    console.log();
  }
}

// function SchemaFunctions(schema) {
//   const object = schema;
//   this.length = () => {
//     return Object.keys(object).length;
//   };
// }

// function schemaFunctions(object) {
//   var schemas;

//   let i = 0;
//   while (i < Object.keys(object).length) {
//     const obj = {
//       key: Object.keys(object)[i],
//       value: Object.values(object)[i],
//     };
//     const mySchemaFunctions = new SchemaFunctions(object[obj.key]);
//     schemas = {
//       ...schemas,
//       ...{
//         ...object,
//         ...{ [`${obj.key}Functions`]: mySchemaFunctions },
//       },
//     };

//     i++;
//   }

//   return schemas;
// }

// console.log(
//   schemaFunctions({
//     admin: [{ char: "a" }, { char: "b" }],
//     teacher: [{ char: "a" }, { char: "b" }],
//   })
// );
