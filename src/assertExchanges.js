module.exports = connection => async (exchanges = []) => {
  const channel = await connection();

  const asserts = exchanges.map((exchange) => {
    const { name, type, options = {} } = exchange;

    return channel.assertExchange(name, type, options);
  });

  return Promise.all(asserts);
};
