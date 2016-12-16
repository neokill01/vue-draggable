'use strict';
exports.install = function(Vue, options) {
  var dropTo = '';
  Vue.directive('draggable', {
    bind: function(el, binding) {
      let data = binding.value;
      const dragstart = function(event) {
        dropTo = binding.arg;
        el.classList.add(binding.value.dragged);
        event.dataTransfer.effectAllowed = 'all';
        event.dataTransfer.setData('data', JSON.stringify(data));
        event.dataTransfer.setData('tag', binding.arg);
        return false;
      };
      const dragend = function(event) {
        el.classList.remove(data.dragged);
        return false;
      };
      el.setAttribute('draggable', true);
      el.addEventListener('dragstart', dragstart);
      el.addEventListener('dragend', dragend);
    },
    inserted: function(el, binding) {
    },
    unbind: function() {
      el.setAttribute('draggable', false);
      el.removeEventListener('dragstart', dragstart);
      el.removeEventListener('dragend', dragend);
    },
    update: function(value, old) {
      data = value;
    }
  });
  Vue.directive('dropzone', {
    acceptStatement: true,
    bind: function(el, binding) {
      const dragenter = function(event) {
        if (dropTo == binding.arg) {
          el.classList.add(binding.arg);
        }
        return false;
      };
      const dragover = function(event) {
        if (event.preventDefault) {
          event.preventDefault();
        }
        // XXX
        if (dropTo == binding.arg) {
          event.dataTransfer.effectAllowed = 'all';
          event.dataTransfer.dropEffect = 'copy';
        } else {
          event.dataTransfer.effectAllowed = 'none';
          event.dataTransfer.dropEffect = 'none';
        }
        return false;
      };
      const dragleave = function(event) {
        if (dropTo == binding.arg) {
          el.classList.remove(binding.arg);
        }
        return false;
      };
      const drop = function(event) {
        if (event.preventDefault) {
          event.preventDefault();
        }
        var tag = event.dataTransfer.getData('tag');
        var data = event.dataTransfer.getData('data');
        if (dropTo == binding.arg) {
          handler(JSON.parse(data));
          el.classList.remove(binding.arg);
        }
        return false;
      };
      const handler = function (data) {
        binding.value.handler(binding.value.index, data);
      };
      el.addEventListener('dragenter', dragenter);
      el.addEventListener('dragleave', dragleave);
      el.addEventListener('dragover', dragover);
      el.addEventListener('drop', drop);
    },
    unbind: function() {
      el.removeEventListener('dragenter', dragenter);
      el.removeEventListener('dragleave', dragleave);
      el.removeEventListener('dragover', dragover);
      el.removeEventListener('drop', drop);
    },
    update: function(value, old) {
      var res = value.handler(binding.value.index, data);
      return res;
    }
  });
};