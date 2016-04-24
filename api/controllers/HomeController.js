'use strict';

const faker = require('faker');
const ObjectId = require('mongodb').ObjectID;
const co = require('co');

module.exports = {

  index: (req, res) => {
    co(function* index() {
      // Grab 50 users
      const users = yield User.find().limit(50);

      if (!users.length) {
        return res.redirect('/generate');
      }

      const nativeStart = process.hrtime();


      // Get widget map results for user
      const userWidgetCollection = yield UserWidget.native;
      const nativeResults = (yield userWidgetCollection.find({
        user_widgets: {
          $in: users.map((user) => new ObjectId(user.id))
        }
      }).toArray()).map((userWidget) => {
        return {
          user: userWidget.user_widgets.toString(),
          widget: userWidget.widget_users.toString()
        };
      });

      const nativeEnd = process.hrtime(nativeStart);
      const nativeTime = (nativeEnd[1] / 1000000) + nativeEnd[0] * 1000;


      // Run same query via waterline
      const waterlineStart = process.hrtime();

      const waterlineResults = yield UserWidget.find().where({
        user: _.map(users, 'id')
      });

      const waterlineEnd = process.hrtime(waterlineStart);
      const waterlineTime = (waterlineEnd[1] / 1000000) + waterlineEnd[0] * 1000;

      return res.view({
        waterlineTime,
        nativeTime,
        nativeResults,
        waterlineResults
      });
    }).catch(ex => res.negotiate(ex));
  },

  generate: (req, res) => {
    co(function* generate() {
      const newWidgets = yield Widget.create(_.range(0, 100).map(() => {
        return {
          name: faker.company.companyName()
        };
      }));

      for (let i = 0; i < 2000; i++) {
        yield User.create({
          name: faker.name.firstName() + ' ' + faker.name.lastName(),
          widgets: _.sample(newWidgets, _.random(1, 5))
        });
      }

      sails.log.info('Generated 100 widgets, 2000 users, and 1-5 widgets per user');
      return res.redirect('/');
    }).catch(ex => res.negotiate(ex));
  }
};
