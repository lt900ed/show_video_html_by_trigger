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

function get_tsv_data(path_data, list_src, wh, enable_loop) {
  $.ajax({
    url: path_data,
    type: 'GET',
    dataType: 'text',
    timeout: 5000,
    success:function(res) {
      var arr = tsv2array(res);
      if (JSON.stringify(window.arr_display) != JSON.stringify(arr[arr.length - 1])) {
        window.arr_display = arr[arr.length - 1];
        var srcArr = list_src[arr[arr.length - 1][1]];
        play_or_add_video(srcArr[Math.floor(Math.random() * srcArr.length)], wh, enable_loop);
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
