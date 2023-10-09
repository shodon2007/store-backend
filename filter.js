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

    let query = `
    SELECT device.*, brand.name AS 'brand' FROM device
    INNER JOIN type ON device.type_id = type.id
    INNER JOIN brand ON device.brand_id = brand.id
    WHERE type.name = "${type}"`;

    if (conditions.length > 0) {
        query += ` AND ${conditions.join(" AND ")}`;
    }

    // Добавляем сортировку, если она указана
    if (inputData.sort) {
        let sort = " ORDER BY";
        if (inputData.sort === "price") {
            sort += " device.price";
        }
        if (inputData.sort === "name") {
            sort += " device.name";
        }
        if (inputData.sort === "date" || inputData.sort === "none") {
            sort += " device.id";
        }
        query += sort;

        console.log(query);
    }

    return query;
}

function isValidPriceFilter(priceFilter) {
    return priceFilter.min >= 0 && priceFilter.max >= priceFilter.min;
}

module.exports = generateFilterQuery;
