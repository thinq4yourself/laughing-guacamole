'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

// const Imager = require('imager');
// const config = require('../../config');
// const imagerConfig = require(config.root + '/config/imager.js');

const Schema = mongoose.Schema;

const getTags = tags => tags.join(',');
const setTags = tags => tags.split(',');

/**
 * Property Schema
 */

const PropertySchema = new Schema({
  title: { type : String, default : '' },
  mls: { type: String },
  description: { type : String, default : '' },
  price: { type: Number, width: 'small' },
  street1: { type: String },
  city: { type: String, width: 'medium' },
  state: { type: String },
  zipcode: { type: Number, width: 'small' },
  neighborhood: { type: String },
  squareFootage: { type: Number, width: 'small' },
  bathrooms: { type: String, default : '' },
  bedrooms: { type: String, default : '' },
  user: { type : Schema.ObjectId, ref : 'User' },
  tags: { type: [], get: getTags, set: setTags },
  image: {
    cdnUri: String,
    files: []
  },
  listedAt: { type : Date, default : Date.now }
});

/**
 * Validations
 */

PropertySchema.path('title').required(true, 'Property title cannot be blank');

/**
 * Pre-remove hook
 */

PropertySchema.pre('remove', function (next) {
  // const imager = new Imager(imagerConfig, 'S3');
  // const files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  // imager.remove(files, function (err) {
  //   if (err) return next(err);
  // }, 'property');

  next();
});

/**
 * Methods
 */

PropertySchema.methods = {

  /**
   * Save property and upload image
   *
   * @param {Object} images
   * @api private
   */

  uploadAndSave: function (image) {
    const err = this.validateSync();
    if (err && err.toString()) throw new Error(err.toString());
    return this.save();

    /*
    if (images && !images.length) return this.save();
    const imager = new Imager(imagerConfig, 'S3');

    imager.upload(images, function (err, cdnUri, files) {
      if (err) return cb(err);
      if (files.length) {
        self.image = { cdnUri : cdnUri, files : files };
      }
      self.save(cb);
    }, 'property');
    */
  }
};

/**
 * Statics
 */

PropertySchema.statics = {

  /**
   * Find property by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (_id) {
    return this.findOne({ _id })
      .populate('user', 'name email username')
      .exec();
  },

  /**
   * List properties
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate('user', 'name username')
      .sort({ listedAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('Property', PropertySchema);
