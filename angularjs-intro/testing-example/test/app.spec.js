'use strict';

describe('Application: myapp', function() {

  // load the service's module
  beforeEach(module('myapp'));

  // testing services and mocking REST calls
  describe('Service: weatherService', function() {

    var url = 'http://api.openweathermap.org/data/2.5/weather?q=Salzburg,at&units=metric&callback=JSON_CALLBACK';
    var $httpBackend, weatherService;

    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      weatherService = $injector.get('weatherService');
    }));

    it('maps the correct current temp', function() {
      $httpBackend.whenJSONP(url).respond({
        main : {
          temp : 10
        }
      });
      $httpBackend.expectJSONP(url);
      var weather = weatherService.getWeather();
      $httpBackend.flush();

      expect(weather.temp.current).toBe(10);
    });

  });

  // testing controllers
  describe('Controller: WeatherCtrl', function() {

    it('calls weatherService to get weather', function() {
      inject(function($rootScope, $controller) {
        var weather = { temp : { current : 10 } }, 
            weatherService = { 
              getWeather : function() {
                return weather;
              }
            }, 
            scope = $rootScope.$new;

        $controller('WeatherCtrl', {
          $scope : scope,
          weatherService : weatherService
        });
        expect(scope.weather).toBe(weather);
      });
    });
  });

  describe('Filter: temp', function() {
    var tempFilter;
    beforeEach(inject(function($filter) {
      tempFilter = $filter('temp');
    }));

    it('adds °C', function() {
      expect(tempFilter(3)).toBe('3.0°C');
    });

    it('handles precision correctly', function() {
      expect(tempFilter(3, 10)).toBe('3.0000000000°C');
    });

    it('handles non-numbers', function() {
      expect(tempFilter('a')).toBe('°C');
      expect(tempFilter({})).toBe('°C');
    });

  });

});
