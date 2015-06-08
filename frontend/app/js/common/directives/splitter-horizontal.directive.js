/**
 * Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Horizontal splitter based on an absolute positioning
 * Allow to resize, close, open two panes
 *
 * Panes should be passed via attributes pane-top and pane-bottom by css selectors
 */
angular.module('pb.directives')
  .directive('splitterHorizontal', function($document, $state) {

    return {
      scope: {
        paneTop: '@',
        paneBottom: '@',
        paneBottomMax: '@',
        paneBottomMin: '@',
        closedOnInit: '@',
        defaultState: '@'
      },
      transclude: true,
      template: '<div class="BottomPanel-splitter"></div>',
      controller: function($scope) {
        this.displayed = true;
        this.topElem = $($scope.paneTop);
        this.bottomElem = $($scope.paneBottom);

        /**
         * Compute new absolute y positioning according to min and max size
         * @param {number} bottom bottom bound of the bottom pane
         * @param {number} pointerY  current pointer y position
         * @returns {number}
         */
        function computeY (bottom, pointerY) {
          var y = bottom - pointerY;
          if (y > $scope.paneBottomMax) {
            y = $scope.paneBottomMax;
          }
          if (y < $scope.paneBottomMin) {
            y = $scope.paneBottomMin;
          }
          return y;
        }

        /**
         * Resize the two panes
         * @param {number} pointerY  current pointer y position
         */
        this.resize = function(pointerY) {
          var y = computeY(this.bottomElem[0].getBoundingClientRect().bottom, pointerY);
          this.topElem.css({bottom: y + 'px'});
          this.bottomElem.css({height: y + 'px'});
        };

        /**
         * Close the bottom pane
         */
        this.closeBottom = function() {
          this.topElem.css({bottom: 0});
          this.bottomElem.addClass('splitter-pane-closed');
          this.displayed = false;
        };

        /**
         * Open the bottom pane
         */
        this.openBottom = function() {
          this.bottomElem.removeClass('splitter-pane-closed');
          this.topElem.css({bottom: this.bottomElem[0].getBoundingClientRect().height + 'px'});
          this.displayed = true;
        };

        this.toggleBottom = function() {
          if (this.displayed) {
            this.closeBottom();
          } else {
            this.openBottom();
          }
        };
      },
      link: function($scope, $element, $attrs, $ctrl) {
        var currentState = $attrs.defaultState;
        var paneTop = $($attrs.paneTop);
        var paneBottom = $($attrs.paneBottom);
        paneTop.addClass('splitter-pane splitter-pane-top');
        paneBottom.addClass('splitter-pane splitter-pane-bottom');
        if (!!$scope.$eval($attrs.closedOnInit) ) {
          $ctrl.closeBottom();
        }

        $element.find('.BottomPanel-splitter').on('mousedown', function(event) {
          event.preventDefault();

          // delegate event to document beacause when moving mouse we go out of the splitter
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        // unbind events
        function mouseup () {
          paneTop.removeClass('splitter-onmove');
          paneBottom.removeClass('splitter-onmove');
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }

        function mousemove (event) {
          paneTop.addClass('splitter-onmove');
          paneBottom.addClass('splitter-onmove');
          $ctrl.resize(event.pageY);
        }

        $element.on('splitter:toggle:bottom', function(event, targetState) {
          event.preventDefault();
          //When the state didn't change it's a panel toggle or panel is hidden
          if(currentState === targetState && $ctrl.displayed || ! $ctrl.displayed){
            $ctrl.toggleBottom();
          }

          if(currentState !== targetState) {
            //Call ui-router to change state
            currentState = targetState;
            $state.go(currentState);
          }

        });
      }
    };
  });
