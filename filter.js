function generateFilterQuery(inputData) {
    const conditions = [];

    for (const key in inputData) {
        if (inputData.hasOwnProperty(key)) {
            const values = inputData[key];
            if (values.length > 0) {
                const condition = `EXISTS (SELECT * FROM attribute WHERE device.id = attribute.device_id AND attribute.title = '${key}' AND attribute.description IN ('${values.join(
                    "', '"
                )}'))`;
                conditions.push(condition);
            }
        }
    }

    if (conditions.length === 0) {
        return "SELECT * FROM device";
    } else {
        return `SELECT * FROM device WHERE ${conditions.join(" AND ")}`;
    }
}

module.exports = generateFilterQuery;
