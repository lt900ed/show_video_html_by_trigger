function play_video(path_src, wh) {
  v = document.createElement('video');
  v.setAttribute('width', wh[0]);
  v.setAttribute('height', wh[1]);

  v.addEventListener("ended", function(){
    this.remove();
  }, false);

  var src = document.createElement('source');
  src.setAttribute('src', path_src)
  v.appendChild(src);

  var body = document.getElementsByTagName('body');
  body[0].appendChild(v);

  v.play();
}

function play_next_video(srcList, wh) {
    window.index += 1;
    if (window.index > srcList.length - 1) {
      window.index = 0
    }
    play_video(srcList[window.index], wh)
}

function play_loop(srcList, wh) {
  if ($('video').length > 0) {
    $('video').on('ended', function() {
      play_next_video(srcList, wh);
    });
  } else {
    play_next_video(srcList, wh);
  }
}

function play_or_add_video(path_src, wh) {
  if ($('video').length > 0) {
    $('video').on('ended', function() {
      play_video(path_src, wh);
    });
  } else {
    play_video(path_src, wh);
  }
}

function get_tsv_data(dataPath, srcList, wh) {
  $.ajax({
    url: dataPath,
    type: 'GET',
    dataType: 'text',
    timeout: 5000,
    success:function(res) {
      var arr = tsv2array(res);
      if (JSON.stringify(window.displayArr) != JSON.stringify(arr[arr.length - 1])) {
        window.displayArr = arr[arr.length - 1];
        var srcArr = srcList[arr[arr.length - 1][1]];
        play_or_add_video(srcArr[Math.floor(Math.random() * srcArr.length)], wh);
      }
    },
    error:function() {
      alert("ロード失敗");
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
