$(function(){
	var audio = $('audio').get(0);
    var database=[];
	var render = function(){
	$.each(database,function(k,v){
		var li = $('<li><strong class="music-name">'+v.artist+'</strong><strong class="btn-del"></strong><strong class="singer-name">'+v.title+'</strong><strong class="play-time">'+v.duration+'</strong></li>');
		$('#ul').append(li);
		
		})
	$('<span>'+database.length+'</span>').appendTo('.play-list-icon')
    }

    
	
	$.getJSON('./database.json')
	.done(function(data){
		database=data;
		render()
	})

	var yangshi = document.getElementById('yangshi');
    $(audio).on('ended',function(){
    	alert(12)
        if( yangshi.className === 'style4'){
        	alert(4)
          nextsong();
        }else if(yangshi.className === 'style3'){
        	alert(3)
          onsongchange(currentsong);
        }else if(yangshi.className === 'style1'){
        	alert(1)
          if(currentsong != database.length-1){
            nextsong();
          }
        }else if(yangshi.className === 'style2'){
        	alert(2)
        	console.log(database.length)
          var rd = Math.floor( Math.random()*database.length );
          onsongchange(rd);
        }
    }) 
    

    var nextsong = function(){
        currentsong  += 1;
        currentsong   = (currentsong == database.length)?0:currentsong;
        onsongchange(currentsong);
      };

	// var audio = $('audio').get(0);
	$('#stop').on('click',function(){
		if(audio.paused){
			audio.play()
		}
		else{
     		audio.pause();
		}
	})
	$('audio').on('play',function(){
		$('#stop').removeClass('play-bt').addClass('pause-bt')
	})
	$(audio).on('pause',function(){
		$('#stop').removeClass('pause-bt').addClass('play-bt')
	})
	//音量
	$('.yl').on('click',function(e){
		audio.volume = e.offsetX / $(this).width()
	})
	$(audio).on('volumechange',function(){
		if(audio.volume === 0){
			$('#yinliang').removeClass('volume-y').addClass('volume-n');
			$('.volume').width(0);
			$('.yl-quan').css('left',0);
		}else{
			$('#yinliang').removeClass('volume-n').addClass('volume-y');
		}
		var left = audio.volume.toFixed(2) * 100 + '%';
		$('xiaoyuandian').css('left',left);
		var width = audio.volume.toFixed(2)*100 + '%';
		$('.volume').width(width);
		$('.yl-quan').css('left',width);
	})
	$('#yinliang').on('click',function(){
		if(audio.volume === 0){
             audio.volume = yuanlai;
		}else{
			yuanlai = audio.volume;
		    audio.volume = 0;
		}
	})
	audio.ontimeupdate = function(){
		var width = audio.currentTime/audio.duration.toFixed(2) * 100 + '%';
		$('.quan2').css('left',width);
		$('.current').css('width',width);
	}
	$('.action').on('click',function(e){
		audio.currentTime = audio.duration* (e.offsetX/$(this).width())
	})
	// //循环列表
    // var span = $('<span>'+database.length+'</span>').appendTo('.play-list-icon');
    var yincang = function(){
    	$('#hidden').fadeToggle();
    }
    $('.play-list-icon').on('click',yincang)
    $('.shou-list').on('click',yincang)
    //列表中当前歌曲切换下一首
    var currentsong = 0;
    var onsongchange = function(a){
    	var b = a || currentsong;
        audio.src = database[ b ].filename;
    	audio.play();
    	var mark = $("#ul li").index( $(this) );
    	console.log(mark)
    	$("#ul li").eq(mark).css({'color':'green'});
        $("#ul li").eq(mark).siblings('li').attr('style','color:#999');
        $('.music-name1').text(database[b].title);
		$('.pre2').text(database[b].artist);
		$('.music-data').text(database[b].duration);
        // $('#ul li').removeClass('play_current');
        // alert(1)
        // $('#ul li').eq( currentsong ).addClass('play_current');
    }
    
	$('.play-list').on('click','li',function(){
		currentsong = $(this).index();
		audio.src = database[currentsong].filename;
		onsongchange();
	})
	$('.play-list').on('click','li',function(){
		var mark = $("#ul li").index( $(this) );
		console.log(mark)
		$("#ul li").eq(mark).css({'color':'green'})
		audio.play()
		$("#ul li").eq(mark).siblings('li').attr('style','color:#999');
		// $("#ul li").eq(mark) ~ li.css({'color':'#999'})
		// $('.music-name1').text(database[currentsong].title)
		// $('.pre2').text(database[currentsong].artist)
		// $('.music-data').text(database[currentsong].duration)
	})

	//上一首 下一首
	$('.pre').on('click',function(){
		currentsong -= 1;
		$('.music-name1').text(database[currentsong].title)
		$('.pre2').text(database[currentsong].artist)
		$('.music-data').text(database[currentsong].duration)
		$("#ul li").eq(currentsong).css({'color':'green'})
        $("#ul li").eq(currentsong).siblings('li').attr('style','color:#999');
		if( currentsong === -1 ){
			console.log(database.length)
			currentsong = database.length-1;			
		}
		audio.src = database[ currentsong ].filename;
		onsongchange();
	})

	$('.next').on('click',function(){
		currentsong += 1;
		$('.music-name1').text(database[currentsong].title)
		$('.pre2').text(database[currentsong].artist)
		$('.music-data').text(database[currentsong].duration)
		$("#ul li").eq(currentsong).css({'color':'green'})
        $("#ul li").eq(currentsong).siblings('li').attr('style','color:#999');
			console.log(currentsong)

		if( currentsong === database.length ){
			currentsong = 0;
		}
		audio.src = database[ currentsong ].filename;
		onsongchange();
	})
	$('#ul li').on('click',function(){
		var mark = $("#ul li").index( $(index) );
		$("#ul li").eq(mark).css({'color':'green'})
		audio.play()
		$("#ul li").eq(mark).siblings('li').attr('style','color:#999');
	})

	$('.play-list').on('mouseenter mouseleave','li',function(){
		$(this).toggleClass('play-hover')
	})
	
	$('#ul').on('click','.btn-del',function(){
		var todelete = $(this).closest('li').index();
		console.log(todelete)
		database = $.grep(database,function(v,k){
				return  k !== todelete;
			})
			$(this).closest('li').remove();
			$('.play-list-icon span').text(database.length);
			console.log(database.length)
			return false;
	})

	$('.empty').on('click',function(){
		$('#ul li').css('display','none');
	})

	$('.close-list').on('click',function(){
		$('#hidden').hide();
		$('#xiabian').toggleClass('gui');
    })

    $('.style').on('click',function(){
    	$('.style-list').toggle();
    })
    $('.style4').on('click',function(){
    	$('.style-list').toggle();
    })

    // $('.style3').on('click',function(){
    // 	$('#yangshi').removeClass('style').addClass('style3');
    // })	
    // 播放模式

     $(yangshi).on('click',function(){
        $('.style-list').css('display','block');
    })
    $('.style-list').on('click','#yang',function(){
        $('.style-list').css('display','none');
        yangshi.className = this.className;
    })
})
