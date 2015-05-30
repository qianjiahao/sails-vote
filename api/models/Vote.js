/**
* Vote.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
  
  attributes: {

  	name: {
  		type: 'string',
      defaultsTo: 'default'
  	},

  	content: {
  		type: 'array',
      defaultsTo: []
  	},

  	createBy: {
  		type: 'string',
  		required: true
  	}
  }
};

