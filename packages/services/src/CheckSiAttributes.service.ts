export function validateAttributes(obj: any, objName: string) {
  if (!obj) {
    throw {
      status: 400,
      message: `Please add all required properties in ${objName}`,
    };
  }

  const plainObject = obj.toObject();
  const schemaAttributes = Object.keys(obj.schema.paths);
  const validAttributes = [
    'company',
    'country',
    'city',
    'address',
    'postcode',
    'idCode',
    'fullName',
    'phone',
    'email',
    'frightfrowrder',
  ];
  const missingAttributes: string[] = [];

  for (const attribute of Object.keys(plainObject)) {
    if (!schemaAttributes.includes(attribute)) {
      throw {
        status: 400,
        message: `Unexpected property in ${objName}: ${attribute}`,
      };
    }

    const value = plainObject[attribute];
    if (value === undefined || value === null || value === '') {
      missingAttributes.push(attribute);
    }
  }

  for (const validatt of validAttributes) {
    const value = plainObject[validatt];
    if (value === undefined || value === null || value === '') {
      missingAttributes.push(validatt);
    }
  }

  if (missingAttributes.length > 0) {
    throw {
      status: 400,
      message: `Missing or empty ${objName} values: ${missingAttributes.join(
        ', ',
      )}`,
    };
  }
}

export function checkProductAttributes(product) {
  const productAttributes = [
    'commodity',
    'HsCode',
    'grossWeight',
    'netWeight',
    'echoterm',
    'billingArea',
    'quantity',
    'cargoType',
  ];

  const missingProductAttributes = productAttributes.filter(
    (attribute) =>
      !product ||
      !Object.prototype.hasOwnProperty.call(product, attribute) ||
      !product[attribute],
  );

  if (missingProductAttributes.length > 0) {
    throw new Error(
      `Missing or empty product attributes: ${missingProductAttributes.join(
        ', ',
      )}`,
    );
  }
}
