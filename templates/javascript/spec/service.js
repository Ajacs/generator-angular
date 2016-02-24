'use strict';

describe('Service: <%= cameledName %>Service', function () {

  // load the service's module
  beforeEach(module('<%= scriptAppName %>'));

  // instantiate service
  var <%= cameledName %>Service_;
  beforeEach(inject(function (_<%= cameledName %>Service_) {
    <%= cameledName %>Service_ = _<%= cameledName %>Service_;
  }));

  it('should do something', function () {
    expect(!!<%= cameledName %>Service_).toBe(true);
  });

});
