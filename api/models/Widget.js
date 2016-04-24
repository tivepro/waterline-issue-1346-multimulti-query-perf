module.exports = {

  schema: true,
  autoUpdatedAt: true,
  autoCreatedAt: true,

  attributes: {

    name: {
      type: 'string'
    },

    users: {
      collection: 'user',
      via: 'widgets'
    }
  }
};
