var app = angular.module("appAngularJS", []);

app.directive("angular2ComponentWrapper", function () {
  return {
    restrict: "E",
    link: function (scope, element) {
      // Renderizar o componente do Angular 2 dentro do elemento
      var ng2Component = new TestComponent();
      ng2Component.render(element[0]);
      console.log("angular2ComponentWrapper")
    },
  };
});
