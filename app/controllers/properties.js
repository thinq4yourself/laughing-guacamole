'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const only = require('only');
const { respond, respondOrRedirect } = require('../utils');
const Property = mongoose.model('Property');
const assign = Object.assign;

/**
 * Load
 */

exports.load = async(function* (req, res, next, id) {
  try {
    req.property = yield Property.load(id);
    if (!req.property) return next(new Error('Property not found'));
  } catch (err) {
    return next(err);
  }
  next();
});

/**
 * List
 */

exports.index = async(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const _id = req.query.item;
  const limit = 30;
  const options = {
    limit: limit,
    page: page
  };

  if (_id) options.criteria = { _id };

  const properties = yield Property.list(options);
  const count = yield Property.count();

  respond(res, 'properties/index', {
    title: 'Properties',
    properties: properties,
    page: page + 1,
    pages: Math.ceil(count / limit)
  });
});

/**
 * New property
 */

exports.new = function (req, res){
  res.render('properties/new', {
    title: 'New Property',
    property: new Property()
  });
};

/**
 * Create property
 */

exports.create = async(function* (req, res) {
  const property = new Property(only(req.body, 'title mls description price street1 city state zipcode neighborhood squareFootage bathrooms bedrooms user image tags listedAt'));
  property.user = req.user;
  try {
    yield property.uploadAndSave(req.file);
    respondOrRedirect({ req, res }, `/properties/${property._id}`, property, {
      type: 'success',
      text: 'Successfully created property'
    });
  } catch (err) {
    respond(res, 'properties/new', {
      title: property.title || 'New Property',
      errors: [err.toString()],
      property
    }, 422);
  }
});

/**
 * Edit property
 */

exports.edit = function (req, res) {
  res.render('properties/edit', {
    title: 'Edit ' + req.property.title,
    property: req.property
  });
};

/**
 * Update property
 */

exports.update = async(function* (req, res){
  const property = req.property;
  assign(property, only(req.body, 'title mls description price street1 city state zipcode neighborhood squareFootage bathrooms bedrooms user image tags listedAt'));
  try {
    yield property.uploadAndSave(req.file);
    respondOrRedirect({ res }, `/properties/${property._id}`, property);
  } catch (err) {
    respond(res, 'properties/edit', {
      title: 'Edit ' + property.title,
      errors: [err.toString()],
      property
    }, 422);
  }
});

/**
 * Show
 */

exports.show = function (req, res){
  respond(res, 'properties/show', {
    title: req.property.title,
    property: req.property
  });
};

/**
 * Delete a property
 */

exports.destroy = async(function* (req, res) {
  yield req.property.remove();
  respondOrRedirect({ req, res }, '/properties', {}, {
    type: 'info',
    text: 'Deleted successfully'
  });
});
