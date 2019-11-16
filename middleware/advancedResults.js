//TODO: Destructure reqQuery.
//TODO: Add custom query messages.
//TODO: Build pagination links.
const advancedResults = (model, populateWith) => async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  //Exclude those fields
  const exclusions = ['select', 'sort', 'page', 'limit'];

  //Loop over exclusions and remove them from reqQuery
  exclusions.forEach(param => delete reqQuery[param]);

  //Create querystring and prepend $ to operators (gt, gte, ect..)
  let queryString = JSON.stringify(reqQuery).replace(
    /\b(gt|gte|lt|lte|in)/g,
    match => `$${match}`
  );

  query = model.find(JSON.parse(queryString));

  //Selection
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  //Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-stats.tokens'); //Sort by user's tokens
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const offset = (page - 1) * limit;
  const end = page * limit;
  const total = await model.countDocuments();

  //Limit
  query = query.skip(offset).limit(limit);

  //Populate
  if (populateWith) {
    query = query.populate(populateWith);
  }

  //Execute query
  const results = await query;

  //Pagination results
  const pagination = {};

  if (end < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (offset > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    sucess: true,
    count: results.length,
    pagination,
    data: results
  };
  next();
};

module.exports = advancedResults;
