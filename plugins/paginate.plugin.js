const paginate = (schema) => {
  //Bạn cũng có thể thêm các hàm tĩnh(static) vào schema của mình
  schema.statics.paginate = async function (query) {
    let { limit, page, sortBy, populate, select, ...filter } = query;

    let sort = "";
    if (sortBy) {
      const sortingCriteria = [];

      sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(".");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });

      sort = sortingCriteria.join(" ");
    } else {
      sort = "-createdAt";
    }
 
    limit = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 9;
    page = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);
    
    if (populate) {
      populate.split(",").forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption.split(".").reduce((a, b) => {
            return { path: b, populate: a };
          })
        );
      });
    }

    docsPromise = docsPromise.select(select).exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };

      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
