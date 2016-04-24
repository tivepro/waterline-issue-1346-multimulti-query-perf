module.exports = {

  schema: true,
  autoUpdatedAt: true,
  autoCreatedAt: true,

  tableName: 'user_widgets__widget_users',
  attributes: {

    user: {
      model: 'user',
      columnName: 'user_widgets'
    },

    widget: {
      model: 'widget',
      columnName: 'widget_users'
    }

  }
};
