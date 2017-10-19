'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const Property = mongoose.model('Property');

/**
 * List items tagged with a tag
 */

exports.index = async(function* (req, res) {
  const criteria = { tags: req.params.tag };
  const page = (req.params.page > 0 ? req.params.page : 1) - 1;
  const limit = 30;
  const options = {
    limit: limit,
    page: page,
    criteria: criteria
  };

  const properties = yield Property.list(options);
  const count = yield Property.count(criteria);

  respond(res, 'properties/index', {
    title: 'Properties that feature ' + req.params.tag,
    properties: properties,
    page: page + 1,
    pages: Math.ceil(count / limit)
  });
});
