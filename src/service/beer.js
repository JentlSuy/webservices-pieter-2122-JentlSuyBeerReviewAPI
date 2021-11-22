const beersRepository = require('../repository/beer');

const getAll = async (
	limit = 100,
	offset = 0,
) => {
	const data = await beersRepository.findAll({ limit, offset });
    const count = await beerRepository.findCount();
	return {
		data,
        count,
		limit,
		offset
	};
};