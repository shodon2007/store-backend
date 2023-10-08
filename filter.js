function generateFilterQuery(inputData, type) {
    const conditions = [];

    // Фильтрация по фильтру
    if (inputData?.filter) {
        for (const key in inputData.filter) {
            if (inputData.filter.hasOwnProperty(key)) {
                const values = inputData.filter[key];
                if (values.length > 0) {
                    const condition = `EXISTS (SELECT * FROM attribute WHERE device.id = attribute.device_id AND attribute.title = '${key}' AND attribute.description IN ('${values.join(
                        "', '"
                    )}'))`;
                    conditions.push(condition);
                }
            }
        }
    }

    // Фильтрация по цене
    if (inputData?.price && isValidPriceFilter(inputData.price)) {
        const priceCondition = `device.price >= ${inputData.price.min} AND device.price <= ${inputData.price.max}`;
        conditions.push(priceCondition);
    }

    // Фильтрация по брендам
    if (inputData?.brands && inputData.brands.length > 0) {
        if (inputData.brands.includes("all")) {
            // Если бренд "all", то не применяем фильтрацию по брендам
        } else {
            const brandsCondition = `device.brand_id IN (SELECT id FROM brand WHERE name IN ('${inputData.brands.join(
                "', '"
            )}'))`;
            conditions.push(brandsCondition);
        }
    }

    if (conditions.length === 0) {
        return `SELECT device.* FROM device INNER JOIN type ON device.type_id = type.id WHERE type.name = "${type}"`;
    } else {
        return `SELECT device.* FROM device INNER JOIN type ON device.type_id = type.id WHERE type.name = "${type}" AND ${conditions.join(
            " AND "
        )}`;
    }
}

function isValidPriceFilter(priceFilter) {
    return priceFilter.min >= 0 && priceFilter.max >= priceFilter.min;
}

module.exports = generateFilterQuery;
