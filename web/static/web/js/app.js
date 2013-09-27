function extend(destination, source) {  
    var toString = Object.prototype.toString,  
        objTest = toString.call({});  
    for (var property in source) {  
        if (source[property] && objTest == toString.call(source[property])) {  
            destination[property] = destination[property] || {};  
            extend(destination[property], source[property]);  
        } else {  
            destination[property] = source[property];  
        }  
    }  
    return destination;  
};  

var app = app || {};

extend(app,
        {database:
          { init:{
             default_init: function() {
                Parse.initialize('wWEy5IgJ7J77iVgB6UZRbpEzaOy80t4BrEQeWcgk','14XH6d74TJPZbh5MjWPDUAbZOi17BYmnLmaY6Ywh');
             },
             custom_init: function(app_id,js_key) {
                Parse.initialize(app_id,js_key);
             },
             
          },utilities: {
              parse: {
                make_query : function(className,filterVals,options) {
                  if ( (typeof options == 'undefined') || (options == null) ) {
                    options = {};
                  }

                  var cls = Parse.Object.extend(className);
                  var query = new Parse.Query(cls);
                  for (var i in filterVals) {
                    // filtervals should look like [('fieldName','targVal'),('fieldName__operator','targVal')]
                    var fieldName,fieldOp = null;
                    var fieldPieces = filterVals[i][0].split('__');
                    fieldName = fieldPieces[0];
                    if (fieldPieces.length>1) {
                      fieldOp = fieldPieces[1];
                    } else {
                      fieldOp = 'eq';
                    }
                    var targetValue = filterVals[i][1]; 

                    if (fieldOp == 'eq') {
                      query = query.equalTo(fieldName,targetValue);
                    } else if (fieldOp == 'nqe') {
                      query = query.notEqualTo(fieldName,targetValue);
                    } else if (fieldOp == 'in') {
                      query = query.containedIn(fieldName,targetValue);
                    } else if (fieldOp == 'nin') {
                      query = query.notContainedIn(fieldName,targetValue);
                    } else if (fieldOp == 'gte') {
                      query = query.greaterThanOrEqualTo(fieldName,targetValue)
                    } else if (fieldOp == 'gt') {
                      query = query.greaterThan(fieldName,targetValue)
                    } else if (fieldOp == 'lte') {
                      query = query.lessThanOrEqualTo(fieldName,targetValue)
                    } else if (fieldOp == 'lt') {
                      query = query.lessThan(fieldName,targetValue)
                    }
                  }

                  if ((typeof options.include != 'undefined') && (options.include != null) ) {
                    query = query.include(options.include);
                  }
                  if ((typeof options.select != 'undefined') && (options.select != null) ) {
                    query = query.select(options.select);
                  }

                  if ( (typeof options.limit != 'undefined') && (options.limit != null) ) {
                    query = query.limit(options.limit);
                  } else {
                    query = query.limit(1000);
                  }
                  if ((typeof options.includeFields != 'undefined') && (options.includeFields != null)) {
                    query = query.include(options.includeFields);
                  }
                  return query;
               },
               data_by_offset : function dbo(query,offset,callback,options) {
                  if ( (typeof options == 'undefined') || (options == null) ) {
                    options = {};
                  }
                  var res = [];
                  query.skip(offset);
                  query.find().then(function(objs){
                    if (objs.length==1000) {
                      dbo(query,offset+1000,callback);

                      if (options.incremental == true) {
                        callback(objs);
                      } else {
                        res = $.merge(res,objs);
                      }

                    } else {
                      // we're done
                      if (options.incremental == true) {
                        callback(objs);
                      } else {
                        res = $.merge(res,objs);
                        callback(res);
                        return;
                      }
                    }
                    
                  });
                },
              data_by_object_id_hack : function dboih(query,lastObjectId,callback,options) {
                    if ( (typeof options == 'undefined') || (options == null) ) {
                      options = {};
                    }

                    var res = [];
                    query.ascending('objectId');
                    if (lastObjectId != null) {
                      query.greaterThan("objectId",lastObjectId);
                    }
                    query.find().then(function(objs){
                      if (objs.length==1000) {
                        dboih(query,objs[objs.length-1].id,callback);
                        
                        if (options.incremental == true) {
                          callback(objs);
                        } else {
                          res = $.merge(res,objs);
                        }
                        
                      } else {
                        // we're done
                        if (options.incremental == true) {
                          callback(objs);
                        } else {
                          res = $.merge(res,objs);
                          callback(res);
                          return;
                        }
                      }
                      
                    });
                }

              } // parse  
            },  // utilities
            services: {
              make_services: function(className,options) {
                  return function() {
                      var baseSvcs = {
                              query:function(callback,filterVals,options) {
                                if ( (typeof options == 'undefined') || (options == null) ) {
                                  options = {};
                                }

                                var query = app.database.utilities.parse.make_query(className,filterVals,options);
                                
                                // if we're not in highvolume mode, we get data doing the normal skip() way
                                // This only works up to 10000 records
                                if ( (typeof options.highVolume == 'undefined') || (options.highVolume == false) ) {
                                  app.database.utilities.parse.data_by_offset(query,null,callback,options);
                                  return;
                                }

                                // if we are in highvolume mode, we do a count query to see if we can get
                                // away with skip(). If not, we do the awful .ascending(objectId) hack. The theory
                                // is that skip() is way faster. Of course, if we really need to return >10000 records
                                // then we're talking about degrees of slow and painful
                                query.count().then(function(obj){
                                  if (obj > 10000) {
                                    // ultrahack!
                                    var _objectId = null;
                                    app.database.utilities.parse.data_by_object_id_hack(query,null,callback,options);
                                    
                                  } else {
                                    //skip/offset
                                    app.database.utilities.parse.data_by_offset(query,0,callback,options);
                                  }
                                })
                                
                                    
                              },
                          count:function(callback,filterVals,options) {
                            if ( (typeof options == 'undefined') || (options == null) ) {
                                options = {};
                            }

                            var query = app.database.utilities.parse.make_query(className,filterVals,options);
                            query.count().then(function(count) {
                                callback(count);
                            });
                                
                          },
                          get:function(callback,objectId) {

                          },
                          upsert:function(callback,doc) {
                        
                            },
                          delete:function(callback,doc) {
                        
                            },
                          
                      };
                      // override or extend with services that have been passed in
                      if ( (typeof options.extra != 'undefined') && (options.extra != null) ) {
                        baseSvcs = $.extend({},baseSvcs,options.extra);
                      }
                      return baseSvcs;
                   }
                  
              } // make_services
              

          } // services
        } // database
      } // root level
    );