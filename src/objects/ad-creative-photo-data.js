/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * @flow
 */
import {AbstractCrudObject} from './../abstract-crud-object';

/**
 * AdCreativePhotoData
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */
export default class AdCreativePhotoData extends AbstractCrudObject {
  static get Fields() {
    return Object.freeze({
     branded_content_sponsor_page_id: 'branded_content_sponsor_page_id',
     branded_content_sponsor_relationship: 'branded_content_sponsor_relationship',
     caption: 'caption',
     image_hash: 'image_hash',
     page_welcome_message: 'page_welcome_message',
     url: 'url',
    });
  }

}
