describe('DeletionPopController', function () {
  var page, modalInstance;

  beforeEach(module('bonitasoft.ui.home'));
  beforeEach(inject(function ($controller, $rootScope, $injector) {
    $scope = $rootScope.$new();

    page = {id: 'page1', name: 'page1'};
    modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);

    $controller('DeletionPopUpController', {
      $scope: $scope,
      $modalInstance: modalInstance,
      artifact: page,
      type: 'page'
    });

    $scope.$apply();
  }));

  it('should close the modal instance', function () {
    $scope.ok();

    expect(modalInstance.close).toHaveBeenCalledWith(page.id);
  });

  it('should dismiss the modal instance', function () {
    $scope.cancel();

    expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
  });

  it('should populate artifact and his type', function () {
    expect($scope.artifact).toEqual(page);
    expect($scope.artifact.type).toBe('page')
  });

});
