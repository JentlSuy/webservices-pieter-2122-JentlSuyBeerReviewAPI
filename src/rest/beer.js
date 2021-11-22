const beerService = require('../service/beer');

const getAllBeers = async (ctx) => {
	ctx.body = await getAll();
};