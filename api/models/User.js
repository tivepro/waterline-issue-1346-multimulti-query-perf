module.exports = {

  schema: true,
  autoUpdatedAt: true,
  autoCreatedAt: true,

  attributes: {

    name: {
      type: 'string'
    },

    widgets: {
      collection: 'widget',
      via: 'users',
      dominant: true
    }
  }
};
