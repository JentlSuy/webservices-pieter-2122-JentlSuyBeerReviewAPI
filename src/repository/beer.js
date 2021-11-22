const { tables, getKnex } = require('../data/index');

const findAll = ({
	limit,
	offset,
}) => {
	return getKnex()(tables.beer)
		.select()
		.limit(limit)
		.offset(offset)
		.orderBy('name', 'ASC');
};

module.exports = {
	findAll,
};