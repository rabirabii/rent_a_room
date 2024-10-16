// HOF untuk menangani Atomic Transaction dalam Sequelize
// supaya tidak perlu membuat commit dan rollback secara terus menerus
const withTransaction = (sequelize) => async (callback) => {
  const transaction = await sequelize.transaction();
  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = { withTransaction };
