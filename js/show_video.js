function play_video(path_src, wh, enable_loop) {
  v = document.createElement('video');
  v.setAttribute('width', wh[0]);
  v.setAttribute('height', wh[1]);

  v.addEventListener("ended", function(){
    if (enable_loop) {
      this.play();
    } else {
      this.remove();
    }
  }, false);

  var src = document.createElement('source');
  src.setAttribute('src', path_src)
  v.appendChild(src);

  var body = document.getElementsByTagName('body');
  body[0].appendChild(v);

  v.play();
}

function play_or_add_video(path_src, wh, enable_loop) {
  if ($('video').length > 0) {
    $('video').on('ended', function() {
      if (enable_loop) {
        this.remove();
      }
      play_video(path_src, wh, enable_loop);
    });
  } else {
    play_video(path_src, wh, enable_loop);
  }
}

function get_start_index(dic_keys) {
  for (let [key, value] of Object.entries(dic_keys)) {
    if (value['mode'] == 'sequent') {
      if ('start_src' in value) {
        window.dic_start_indexes[key] = Math.max(value['src'].indexOf(value['start_src']), 0)
      } else if ('start_index' in value) {
        window.dic_start_indexes[key] = Math.min(value['start_index'], value['src'].length - 1)
      } else {
        window.dic_start_indexes[key] = 0
      }
    }
  }
}

function get_tsv_data(path_data, dic_keys, wh, enable_loop) {
  $.ajax({
    url: path_data,
    type: 'GET',
    dataType: 'text',
    timeout: 5000,
    success:function(res) {
      var arr = tsv2array(res);
      if (JSON.stringify(window.arr_display) != JSON.stringify(arr[arr.length - 1])) {
        window.arr_display = arr[arr.length - 1];
        var str_key = arr[arr.length - 1][1];
        if (str_key in dic_keys && dic_keys[str_key]['src'].length > 0) {
          var src_arr = dic_keys[str_key]['src'];
          if (dic_keys[str_key]['mode'] == 'sequent') {
            play_or_add_video(src_arr[window.dic_start_indexes[str_key]], wh, enable_loop);
            if (window.dic_start_indexes[str_key] + 1 > src_arr.length - 1) {
              window.dic_start_indexes[str_key] = 0
            } else {
              window.dic_start_indexes[str_key] += 1
            }
          } else {
            play_or_add_video(src_arr[Math.floor(Math.random() * src_arr.length)], wh, enable_loop);
          }
        }
      }
    },
    error:function() {
    }
  });
}

function tsv2array(data) {
  const dataArray = [];
  const dataString = data.split('\r\n');
  var tmp_arr;
  for (let i = 0; i < dataString.length; i++) {
    tmp_arr = dataString[i].split('\t');
    if (tmp_arr.length == 2) {
      dataArray[i] = dataString[i].split('\t');
    }
  }
  return dataArray;
}
